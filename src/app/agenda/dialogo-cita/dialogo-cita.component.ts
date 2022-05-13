import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CitasService } from 'src/app/services/citas.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { UtilService } from 'src/app/services/util.service';
import { Paciente } from 'src/model/paciente';
import { Cita } from './../../../model/cita';

@Component({
  selector: 'app-dialogo-cita',
  templateUrl: './dialogo-cita.component.html',
  styleUrls: ['./dialogo-cita.component.css']
})
export class DialogoCitaComponent implements OnInit {

	cargando: boolean = false;
	creando: boolean = false;
	titulo: string = '';
	cita: Cita = new Cita();
	pacientes: Paciente[] = [];	

	constructor(
		private citasService: CitasService,
		private pacientesService: PacientesService,
		public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoCitaComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
			if (data.idCita) {
				this.titulo = "Cita"
				this.creando = false;
				this.cita.idCita = data.idCita;
			} else {
				this.titulo = "Crear Cita";
				this.creando = true;
			}

			this.obtenerPacientes();
		}

	ngOnInit(): void {
	}

	refrescar() {
		this.cargando = true;
        this.citasService
            .obtenerCitaPorId(this.cita.idCita)
            .then(cita => {
				this.cita = cita;

				this.cita.fecha = this.cita.fecha.split(' ')[0];

				console.log(this.pacientes);
				if (this.cita.paciente && this.cita.paciente.idPaciente) this.cita.paciente = this.pacientes.find(e => e.idPaciente == this.cita.paciente.idPaciente);
				console.log(this.cita);
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false)
	}

	obtenerPacientes() {
        this.cargando = true;
        this.pacientesService
            .obtenerPacientes()
            .then(pacientes => {
				this.pacientes = pacientes;
				if (!this.creando) this.refrescar();
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }

	crear() {
        this.cargando = true;
        this.citasService
            .insertarCita(this.cita)
            .then(cita => {
				this.cerrar('creado');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }

	editar() {
		this.cargando = true;
        this.citasService
            .editarCita(this.cita)
            .then(usuario => {
				this.cerrar('editado');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
	}

	eliminar() {
		this.cargando = true;
        this.citasService
            .eliminarCita(this.cita.idCita)
            .then(usuario => {
				this.cerrar('editado');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
