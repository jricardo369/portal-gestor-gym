import { Injectable } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { API_URL } from '../app.config';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { resolve } from 'path';
import { promise } from 'protractor';

export interface SessionServiceListener { onCerrarSesion(); onIniciarSesion(); }

const IDIOMA_ESPAÑOL_MEXICO = 'es_mx';
const IDIOMA_ESPAÑOL_ESPAÑA = 'es_es';
const IDIOMA_PORTUGUES = 'pt';
const IDIOMA_INGLES = 'en';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    idiomaCambiado = false;
    public xmlObligatorio = true;
    lastValidation: number = 0;

    private usuarioPromise: Promise<Usuario>;

    private listeners: SessionServiceListener[];

    constructor(private http: HttpClient) {
        this.listeners = [];

        /*if (this.idiomaCambiado === false) {
            let lang = 'es';
            if (document.location.href.includes('/en')) { lang = 'en'; }
            if (document.location.href.includes('/es')) { lang = 'es'; }
            this.cambiarIdioma(lang).then(e0 => { }).catch(e => { });
            this.idiomaCambiado = true;
        }*/
    }

    addListener(listener: SessionServiceListener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }

    iniciarSesion(usuario: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => this.http
            .post(API_URL + 'autenticaciones/inicio-sesion', 
            {
                usuario: usuario,
                contrasenia: password
            },
            { withCredentials: true, observe: 'response', responseType: 'text' })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    //localStorage.clear();

                    let lang = 'es';

                    if (document.location.href.includes('/en')) { lang = 'en'; }
                    if (document.location.href.includes('/es')) { lang = 'es'; }

                    // this.cambiarIdioma(lang).then(e0 => { }).catch(e => { });

                    this.listeners.forEach(e => e.onIniciarSesion());

                    localStorage.setItem('auth_token', response.body);
                    localStorage.setItem('usuario', usuario);
                    resolve(true);
                } else { resolve(false); }
            })
            .catch(reason => reject(reason))
        );
    }

    cambiarIdioma(idioma: string) {
        return new Promise((resolve, reject) => this.http
            .put(API_URL + 'config/idioma', idioma, { withCredentials: true }).toPromise()
            .then(e => resolve(e))
            .catch(e => reject(e)));
    }

    cerrarSesion(): boolean {
        localStorage.clear();
        this.listeners.forEach(e => e.onCerrarSesion());
        return true;
    }

    cambiarCredenciales(password: string, email: string) {
        return new Promise((resolve, reject) => {
            let params = new HttpParams();
            this.http
                .put(API_URL + "/credentials", null, {
                    params: {
                        password: password,
                        email: email
                    },
                    withCredentials: true,
                    observe: 'response'
                })
                .toPromise()
                .then(r => {
                    if (r.status == 204) resolve(true);
                    else resolve(false);
                }).catch(r => {
                    if (r.status == 401) resolve(false);
                    else reject(r);
                });
        });
    }

}
