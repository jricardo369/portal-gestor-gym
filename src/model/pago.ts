import { Paciente } from './paciente';
import { TipoPago } from './tipoPago';

export class Pago {
    idMovimiento: number;
    fecha: string;
    monto: number;
    paciente: Paciente;
    tipoMovimiento: TipoPago;
}