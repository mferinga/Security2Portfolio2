import { Component, Input, OnInit } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ContractService } from 'src/app/infrastructure/contract.service';
import { FieldService } from 'src/app/infrastructure/field.service';
import { TemplateService } from 'src/app/infrastructure/template.service';
import { ITemplateVM } from 'src/app/template/template.model';

let pdfMake = require('pdfmake/build/pdfmake');
//Custom font containing Times New Roman
let pdfFonts = require('./vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
    TimesNewRoman: {
        normal: 'TimesNewRoman-Regular.ttf',
        bold: 'TimesNewRoman-Bold.ttf',
        italics: 'TimesNewRoman-Italic.ttf',
        bolditalics: 'TimesNewRoman-BoldItalic.ttf',
    },
};
let htmlToPdfmake = require('html-to-pdfmake');

@Component({
    selector: 'app-contract-generate-button',
    templateUrl: './contract-generate-button.component.html',
    styleUrls: ['./contract-generate-button.component.scss'],
})
export class ContractGenerateButtonComponent implements OnInit {
    faDownload = faDownload;
    templates: ITemplateVM[] = [];
    @Input() contractId: string | undefined;
    @Input() iconOnly: boolean = false;

    constructor(
        private templateService: TemplateService,
        private contractService: ContractService
    ) {}

    ngOnInit(): void {
        this.templateService
            .getAllTemplates()
            .subscribe((templates: ITemplateVM[]) => {
                this.templates = templates;
            });
    }

    downloadContractByTemplate(templateId: string) {
        this.templateService
            .getTemplateById(templateId)
            .subscribe((template) => {
                this.contractService
                    .getContractByIdWithFields(this.contractId!)
                    .subscribe(async (contract) => {
                        let tempHtml = template.content;

                        //Get all shortcodes in the document
                        let shortcodes = tempHtml.match(/{(.*?)}/gm);
                        
                        //If there are shortcodes in the document
                        if (shortcodes != null) {
                            //Loop through the shortcodes
                            for (let shortcodeWithBrackets of shortcodes) {
                                //Remove the brackets from the shortcode
                                const shortcode = shortcodeWithBrackets.slice(
                                    1,
                                    -1
                                );

                                //Set the required fields
                                let requiredFields = {
                                    'verplicht-organisatie-naam':
                                        contract.organisation.name,
                                    'verplicht-organisatie-kvk':
                                        contract.organisation.organisationIdentifier,
                                    'verplicht-organisatie-adres':
                                        contract.organisation.address,
                                    'verplicht-organisatie-postcode':
                                        contract.organisation.zipcode,
                                    'verplicht-organisatie-plaats':
                                        contract.organisation.city,
                                    'verplicht-organisatie-land':
                                        contract.organisation.country,

                                    'verplicht-verwerker-naam':
                                        contract.supplier.name,
                                    'verplicht-verwerker-baan-positie':
                                        contract.supplier.jobTitle,

                                    'verplicht-laatst-aangepast-door':
                                        contract.lastEditedBy.name,

                                    'verplicht-laatst-aangepast-op': new Date(
                                        contract.lastEditedDate
                                    ).toLocaleDateString(),

                                    'verplicht-klant-organisatie-naam':
                                        contract.customer.name,
                                    // 'verplicht-organisatie-vertegenwoordiger':
                                    //     contract.customer.representative,
                                    'verplicht-klant-baan-positie':
                                        contract.customer.jobTitle,
                                    'verplicht-klant-adres':
                                        contract.customer.address,
                                    'verplicht-klant-postcode':
                                        contract.customer.postalCode,
                                    'verplicht-klant-plaats':
                                        contract.customer.city,
                                    'verplicht-klant-land':
                                        contract.customer.country,

                                    'verplicht-gesigneerd-datum': new Date(
                                        contract.dateOfSigning!
                                    ).toLocaleDateString(),

                                    'verplicht-gesigneerd-locatie':
                                        contract.locationOfSigning,
                                };

                                //Loop through all the required fields and get the shortcode name
                                for await (let [
                                    requiredField,
                                    requiredFieldData,
                                ] of Object.entries(requiredFields)) {
                                    //If the shortcode name matches the field name, replace the shortcode with the field name
                                    if (requiredField === shortcode) {
                                        tempHtml = tempHtml.replace(
                                            shortcodeWithBrackets,
                                            requiredFieldData
                                        );
                                    }

                                    
                                }
                            }

                            //Get all the shortcodes in the document
                            shortcodes = tempHtml.match(/{(.*?)}/gm);

                            //Loop through the shortcodes
                            for (let shortcodeWithBrackets of shortcodes!) {
                                //Remove the brackets from the shortcode
                                const shortcode = shortcodeWithBrackets.slice(
                                    1,
                                    -1
                                );

                                //Loop through all the optional fields and get the shortcode name
                                if (contract.responses) {
                                    // Loop through all the optional fields in the contract
                                    for await (let response of contract.responses) {
                                        //If the found shortcode name matches the field shortcode, replace the shortcode with the field name
                                        if (response.field?.shortcodeName === shortcode) {
                                            //If the field is specifiable replace the shortcode with the field data, else replace it with "Ja"
                                            if(response.field.isSpecifiable) {
                                                tempHtml = tempHtml.replace(
                                                    shortcodeWithBrackets,
                                                    response.data?.toString()!
                                                );
                                            } else {
                                                tempHtml = tempHtml.replace(
                                                    shortcodeWithBrackets,
                                                    "Ja"
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            //Get all the shortcodes in the document
                            shortcodes = tempHtml.match(/{(.*?)}/gm);

                            //Loop through the shortcodes that are not filled in
                            for (let shortcodeWithBrackets of shortcodes!) {
                                if(contract.responses) {
                                    for await (let response of contract.responses) {
                                        tempHtml = tempHtml.replace(
                                            shortcodeWithBrackets,
                                            "Niet van toepassing"
                                        );
                                    }
                                }
                            }
                        }

                        //Convert the html to pdfmake format
                        const html = htmlToPdfmake(tempHtml);
                        const document = {
                            content: html,
                            defaultStyle: { font: 'TimesNewRoman' },
                        };
                        
                        //Create the pdf and download it for the user
                        pdfMake.createPdf(document).download(contract.title + '     (' + template.name + ')');
                    });
            });
    }
}
