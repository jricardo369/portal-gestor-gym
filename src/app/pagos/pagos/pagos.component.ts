import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { Paciente } from 'src/model/paciente';
import { PaginationManager } from 'src/util/pagination';
import { DialogoPagoComponent } from './../dialogo-pago/dialogo-pago.component';
import { Pago } from './../../../model/pago';
import { PagosService } from './../../services/pagos.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { ReportesService } from './../../services/reportes.service';
import { ReporteMovimiento } from './../../../model/reporteMovimiento';
import { Usuario } from './../../../model/usuario';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

	cargando: boolean = false;
	esPaciente: boolean = false;
	titulo: string = "";
	pacientes: Paciente[] = [];
	paciente: Paciente = new Paciente();
	reporteMovimiento: ReporteMovimiento = {saldo: 0, totalAdeudos: 0, totalIngreso: 0};

	pagos: Pago[] = [];

	fechaInicio: string = "";
	fechaFin: string = "";

	paginacion: PaginationManager = new PaginationManager();

	constructor(
		private pagosService: PagosService,
		private pacientesService: PacientesService,
		private reportesService: ReportesService,
        activatedRoute: ActivatedRoute,
		private router: Router,
		public utilService: UtilService,
        private dialog: MatDialog) {
			this.fechaInicio = this.dateAsYYYYMMDD(this.obtenerPrimerDiaDeSemana(new Date(Date.now()), 0));
			this.fechaFin = this.dateAsYYYYMMDD(this.obtenerUltimoDiaDeSemana(new Date(Date.now()), 6));

			if (activatedRoute.routeConfig.path == 'pagos') {
				this.esPaciente = false;
				this.titulo = "Pagos";
				this.obtenerPacientes();
			}
			else if (activatedRoute.routeConfig.path == 'mis-pagos') {
				this.esPaciente = true;
				this.titulo = "Mis pagos";
				this.obtenerPaciente();
			}
		}

	ngOnInit(): void {
	}

	obtenerPrimerDiaDeSemana(hoy: Date, primerDia: number): Date {
		while (hoy.getDay() !== primerDia) {
			hoy.setDate(hoy.getDate() - 1);
		}
		return hoy;
	}

	obtenerUltimoDiaDeSemana(hoy: Date, ultimoDia: number): Date {
		while (hoy.getDay() !== ultimoDia) {
			hoy.setDate(hoy.getDate() + 1);
		}
		return hoy;
	}

	dateAsYYYYMMDD(date: Date): string {
		return '' + date.getFullYear() + '-' + this.withLeadingZeros((date.getMonth() + 1), 2) + '-' + this.withLeadingZeros((date.getDate()), 2);
	}

	withLeadingZeros(integer: number, digits: number): string {
		let n = '' + Number.parseInt('' + integer);
		for (let i = n.length; i < digits; i++) n = '0' + n;
		return n;
	}

	obtenerPacientes() {
        this.cargando = true;
        this.pacientesService
            .obtenerPacientes()
            .then(pacientes => {
				this.pacientes = pacientes;
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }

	obtenerPaciente() {
		let usuario: Usuario = JSON.parse(localStorage.getItem('objUsuario'));
        this.cargando = true;
        this.pacientesService
            .obtenerPaciente((usuario.paciente))
            .then(paciente => {
				this.paciente = paciente;
				console.log(this.paciente);
				this.refrescar();
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }

	obtenerReporte() {
        this.cargando = true;
        this.reportesService
            .obtenerReporteTotalDeMovimientosDePaciente(this.paciente.idPaciente)
            .then(reporteMovimiento => {
				this.reporteMovimiento = reporteMovimiento;
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }

	refrescar() {
		this.cargando = true;
        this.pagosService
            .obtenerMovimientosDePacientePorFecha(this.paciente.idPaciente, this.fechaInicio, this.fechaFin)
            .then(pagos => {
				this.pagos = pagos;
				this.paginacion.setArray(this.pagos);
				console.log(this.pagos)
				this.obtenerReporte();
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false)
	}

	crearPago() {
		this.dialog.open(DialogoPagoComponent, {
            data: {},
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'creado') { if(this.paciente && this.paciente.idPaciente)  this.refrescar(); }
        }).catch(reason => this.utilService.manejarError(reason));
	}

	abrirPago(idMovimiento: number) {
		this.dialog.open(DialogoPagoComponent, {
            data: {
				idMovimiento: idMovimiento,
				esPaciente: this.esPaciente
			},
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'editado') this.refrescar();
        }).catch(reason => this.utilService.manejarError(reason));
	}

	descargarPdfGeneral() {
		this.reportesService
			.obtenerPdfPagosGeneral()
			.subscribe(
				data => {
				const file = new Blob([data], { type: 'application/pdf' });
				const fileURL = URL.createObjectURL(file);
				window.open(fileURL);
				}
			);
	}

	descargarPdfPaciente() {
		this.reportesService
			.obtenerPdfPagosPaciente(this.paciente.idPaciente)
			.subscribe(
				data => {
				const file = new Blob([data], { type: 'application/pdf' });
				const fileURL = URL.createObjectURL(file);
				window.open(fileURL);
				}
			);
	}

}
