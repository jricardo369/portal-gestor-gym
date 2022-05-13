import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasComponent } from './citas/citas.component';
import { AgendaNavComponent } from './agenda-nav/agenda-nav.component';
import { DentalUiModule } from '../dental-ui/dental-ui.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { AgendaRoutingModule } from './agenda-routing.module';
import { DialogoCitaComponent } from './dialogo-cita/dialogo-cita.component';



@NgModule({
	declarations: [
		CitasComponent,
		AgendaNavComponent,
		DialogoCitaComponent, 
	],
	imports: [
		CommonModule,
		DentalUiModule,
		AgendaRoutingModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        FormsModule,
        MatStepperModule,
        MatSliderModule,
        MatSelectModule,
	],
    entryComponents: [
        DialogoCitaComponent,
        
    ]
})
export class AgendaModule { }
