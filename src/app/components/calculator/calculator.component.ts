import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

    public form!: FormGroup;
    public submittedFields: { [key: string]: boolean } = {
        real_estate_price: false,
        rental_price: false,
        additional_expenses: false,
    };

    public income = {
        perMonth: 0,
        first12Months: 0,
        first24Months: 0,
        perThreeYears: 0,
        fullPayback: 0
    }

    private taxCoefficients: number[] = [0.8, 0.75, 0.7];

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            real_estate_price: ['', [Validators.required, Validators.min(0)]],
            rental_price: ['', [Validators.required, Validators.min(0)]],
            additional_expenses: ['', [Validators.required, Validators.min(0)]],
        });
    }

    errorHandling(control: string, error: string): boolean {
        return this.form.controls[control].hasError(error);
    };

    fieldInFocus(control: string): void {
        this.submittedFields[control] = false;
    }

    fieldOutFocus(control: string): void {
        this.submittedFields[control] = true;
    }

    calculateIncome() {
        const realEstatePrice = +this.form.controls['real_estate_price'].value;
        const rentalPrice = +this.form.controls['rental_price'].value;
        const additionalExpenses = +this.form.controls['additional_expenses'].value;

        const perMonth = (rentalPrice - additionalExpenses) * this.taxCoefficients[0];
        const first12Months = (rentalPrice - additionalExpenses) * this.taxCoefficients[2];
        const first24Months = (rentalPrice - additionalExpenses) * this.taxCoefficients[1];

        const perYear = perMonth * 12;
        const differenceFirstYear = perYear - ((rentalPrice - additionalExpenses) * 12 * this.taxCoefficients[2]);
        const differenceSecondYear = perYear - ((rentalPrice - additionalExpenses) * 12 * this.taxCoefficients[1]);

        this.income.perMonth = perMonth;
        this.income.first12Months = first12Months;
        this.income.first24Months = first24Months;
        this.income.perThreeYears = (perYear * 3) - differenceFirstYear - differenceSecondYear;
        this.income.fullPayback = Math.ceil(((realEstatePrice + differenceFirstYear + differenceSecondYear) / perMonth) / 12);
    }

    submit(): void {
        for (let field in this.submittedFields) {
            this.submittedFields[field] = true;
        }

        if (this.form.valid) {
            this.calculateIncome();
        }
    }
}
