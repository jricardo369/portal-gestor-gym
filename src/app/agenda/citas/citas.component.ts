import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CitasService } from 'src/app/services/citas.service';
import { UtilService } from 'src/app/services/util.service';
import { DialogoCitaComponent } from '../dialogo-cita/dialogo-cita.component';
import { Cita } from './../../../model/cita';

export class Semana {
	lunes: Cita[];
	martes: Cita[];
	miercoles: Cita[];
	jueves: Cita[];
	viernes: Cita[];
	sabado: Cita[];
	domingo: Cita[];
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit {

	cargando: boolean = false;

	// fecha0: string = "";
	fecha: string = "";
	citas: Semana = new Semana();
	// citasLunes: Cita[] = [];
	// citasMartes: Cita[] = [];
	// citasMiercoles: Cita[] = [];
	// citasJueves: Cita[] = [];
	// citasViernes: Cita[] = [];
	// citasSabado: Cita[] = [];
	// citasDomingo: Cita[] = [];
	
	constructor(
		private citasService: CitasService,
		private router: Router,
		public utilService: UtilService,
        private dialog: MatDialog) {
			this.fecha = this.dateAsYYYYMMDD(new Date(Date.now()));
			// this.fecha0 = this.dateAsYYYYMMDD(this.obtenerPrimerDiaDeSemana(new Date(this.fecha)));
			this.refrescar();
	}

	ngOnInit(): void {
	}

	refrescar() {
		this.cargando = true;
        this.citasService
            .obtenerCitasPorSemana(this.fecha)
            .then(citas => {
				// this.citas = citas;
				this.organizarCitasDeSemana(
					this.obtenerPrimerDiaDeSemana(new Date(this.fecha)),
					citas
				);
				console.log(this.citas);
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false)
	}

	organizarCitasDeSemana(inicio: Date, citas: Cita[]) {
		while (inicio.getDay() <= 6) {

			let fecha = this.dateAsYYYYMMDD(inicio);
			// console.log(fecha)

			switch (inicio.getDay()) {
				case 0:
					this.citas.domingo = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				case 1:
					this.citas.lunes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				case 2:
					this.citas.martes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				case 3:
					this.citas.miercoles = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				case 4:
					this.citas.jueves = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				case 5:
					this.citas.viernes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				case 6:
					this.citas.sabado = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as Cita[];
					break;
				default:
					break;
			}

			if (inicio.getDay() == 6) break;
			inicio.setDate(inicio.getDate() + 1);
		}
	}

	obtenerPrimerDiaDeSemana(fecha: Date): Date {
		while (fecha.getDay() !== 0) {
			fecha.setDate(fecha.getDate() - 1);
		}
		return fecha;
	}

	dateAsYYYYMMDD(date: Date): string {
		return '' + date.getFullYear() + '-' + this.withLeadingZeros((date.getMonth() + 1), 2) + '-' + this.withLeadingZeros((date.getDate()), 2);
	}

	withLeadingZeros(integer: number, digits: number): string {
		let n = '' + Number.parseInt('' + integer);
		for (let i = n.length; i < digits; i++) n = '0' + n;
		return n;
	}

	mostrarHoraDeCita(horaInicio: string = '', horaFin: string = ''): string {
		let arrayHI: string[] = horaInicio.split(':');
		let arrayHF: string[] = horaFin.split(':');
		
		return ((parseInt(arrayHI[0]) + 11) % 12 + 1).toString() + ':' + arrayHI[1] + (parseInt(arrayHI[0]) < 12 ? 'am' : 'pm') + ' a ' + ((parseInt(arrayHF[0]) + 11) % 12 + 1).toString() + ':' + arrayHF[1] + (parseInt(arrayHF[0]) < 12 ? 'am' : 'pm');
	}

	// dateAsDDMMYYYY(date: string): string {
	// 	var splitted = date.split('-'); 
	// 	return '' + splitted[2] + '/' + splitted[1] + '/' + splitted[0];
	// }






	crearCita() {
		this.dialog.open(DialogoCitaComponent, {
            data: {},
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'creado') this.refrescar();
        }).catch(reason => this.utilService.manejarError(reason));
	}

	abrirCita(idCita: number) {
		this.dialog.open(DialogoCitaComponent, {
            data: {
				idCita: idCita
			},
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'editado') this.refrescar();
        }).catch(reason => this.utilService.manejarError(reason));
	}

}
