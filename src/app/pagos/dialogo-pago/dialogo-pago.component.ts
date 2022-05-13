import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacientesService } from 'src/app/services/pacientes.service';
import { UtilService } from 'src/app/services/util.service';
import { Paciente } from './../../../model/paciente';
import { Pago } from './../../../model/pago';
import { TipoPago } from './../../../model/tipoPago';
import { PagosService } from './../../services/pagos.service';

@Component({
  selector: 'app-dialogo-pago',
  templateUrl: './dialogo-pago.component.html',
  styleUrls: ['./dialogo-pago.component.css']
})
export class DialogoPagoComponent implements OnInit {

	cargando: boolean = false;
	creando: boolean = false;
	esPaciente: boolean = false;
	titulo: string = '';

	pago: Pago = new Pago();
	pacientes: Paciente[] = [];
	tiposPago: TipoPago[] = [];

	constructor(
		private pagosService: PagosService,
		private pacientesService: PacientesService,
		public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoPagoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
			// this.tiposPago.push({ idTipo: 1, descripcion: "Cargo"});
			// this.tiposPago.push({ idTipo: 2, descripcion: "Abono"});
			if (data.idMovimiento) {
				this.titulo = "Pago"
				this.creando = false;
				this.pago.idMovimiento = data.idMovimiento;
				this.esPaciente = data.esPaciente;
			} else {
				this.titulo = "Nuevo Pago";
				this.creando = true;
			}

			this.ejecutarServicios();
		}

	ngOnInit(): void {
	}

	ejecutarServicios() {
		let promises = [];
		promises.push(this.pacientesService.obtenerPacientes());
		promises.push(this.pagosService.obtenerTiposMovimientos());

		this.cargando = true;
		Promise
            .all(promises)
            .then(results => {
                console.log(results)
				this.pacientes = results[0];
				this.tiposPago = results[1];
				if (!this.creando) this.refrescar();
            }).catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
	}

	refrescar() {
		this.cargando = true;
        this.pagosService
            .obtenerMovimientoPorId(this.pago.idMovimiento)
            .then(pago => {
				this.pago = pago;

				this.pago.fecha = this.pago.fecha.split(' ')[0];

				// console.log(this.pacientes);
				if (this.pago.paciente && this.pago.paciente.idPaciente) this.pago.paciente = this.pacientes.find(e => e.idPaciente == this.pago.paciente.idPaciente);
				if (this.pago.tipoMovimiento && this.pago.tipoMovimiento.idTipo) this.pago.tipoMovimiento = this.tiposPago.find(e => e.idTipo == this.pago.tipoMovimiento.idTipo);
				console.log(this.pago);
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false)
	}

	crear() {
        this.cargando = true;
        this.pagosService
            .insertarMovimiento(this.pago)
            .then(pago => {
				this.cerrar('creado');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }

	editar() {
		this.cargando = true;
        this.pagosService
            .editarMovimiento(this.pago)
            .then(pago => {
				this.cerrar('editado');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
	}

	eliminar() {
		this.cargando = true;
        this.pagosService
            .eliminarMovimiento(this.pago.idMovimiento)
            .then(pago => {
				this.cerrar('editado');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
