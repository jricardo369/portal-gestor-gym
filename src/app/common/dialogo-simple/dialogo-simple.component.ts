import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Inject, Component } from "@angular/core";

@Component({
    selector: 'dialogo-simple',
    templateUrl: 'dialogo-simple.component.html',
    styleUrls: ['./dialogo-simple.component.scss']
})
export class DialogoSimpleComponent {

    titulo: string;
    texto: string;
    botones: any[];

    // COMBOBOX
    comboboxLabel: string;
    comboboxItems: any[];
    comboboxDisplayField: string;
    comboboxSublabel: string;
    selectedItem: any;

    // FIELDS
    fields: any[] = null;
    values: any[] = [];

    public textarea: any;

    constructor(
        public dialogRef: MatDialogRef<DialogoSimpleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.titulo = data.titulo;
        this.texto = data.texto;
        this.botones = data.botones;
        this.textarea = data.textarea;

        this.comboboxLabel = data.comboboxLabel;
        this.comboboxItems = data.comboboxItems;
        this.comboboxDisplayField = data.comboboxDisplayField;
        this.comboboxSublabel = data.comboboxSublabel;

        this.fields = data.fields;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onFieldChange(event: Event, field: any) {
        let value: any = (event.srcElement as HTMLInputElement).value;
        if (field.type == "number") value = Number.parseFloat(value);
        field.value = value;
    }
}