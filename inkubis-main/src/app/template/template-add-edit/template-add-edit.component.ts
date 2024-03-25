import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from 'src/app/infrastructure/template.service';
import { environment } from 'src/environments/environment';
import { ITemplate } from '../template.model';
import { TinyMCE } from 'tinymce';
import { ICategory, IField } from 'src/app/contract/step2/field.model';
import { CategoryService } from 'src/app/infrastructure/category.service';
import { FieldService } from 'src/app/infrastructure/field.service';
declare const tinymce: TinyMCE;

@Component({
    selector: 'app-template-add-edit',
    templateUrl: './template-add-edit.component.html',
    styleUrls: ['./template-add-edit.component.scss'],
})
export class TemplateAddEditComponent implements OnInit {
    template: ITemplate = {
        id: '',
        name: '',
        templateImage: '',
        content: '',
    };

    imageBase64: any;
    imgSrc: string = '';
    isEdit: boolean = false;
    validTiny: boolean = false;
    validName: boolean = false;
    apiKey = environment.tiny_api_key;
    categories: ICategory[] = [];

    fieldsByCategory: any[] = [];

    constructor(
        private router: Router,
        private templateService: TemplateService,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private categoryService: CategoryService,
        private fieldService: FieldService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            let id = params.get('id');
            if (id) {
                this.isEdit = true;
                this.validTiny = true;
                this.validName = true;
                this.templateService.getTemplateById(id).subscribe((result) => {
                    this.template = result;
                    this.imgSrc = this.template.templateImage;
                    this.imageBase64 = this.template.templateImage;
                    this.validate();
                });
            }
        });

        this.fieldService.getAllFields().subscribe((allFields: IField[]) => {
            this.splitFieldsInCategoryArrays(allFields);
            this.setupTinyMce();
        });
    }

    splitFieldsInCategoryArrays(allFields: IField[]) {
        let categories: any[] = [];

        allFields.forEach((field: IField) => {
            if (categories.length) {
                if (categories.find((c) => c.name == field.category.name)) {
                } else {
                    categories.push({
                        name: field.category.name,
                        fields: [],
                    });
                }
            } else {
                categories.push({
                    name: field.category.name,
                    fields: [],
                });
            }
        });

        allFields.forEach((field: IField) => {
            categories.forEach((category: any) => {
                if (category.name == field.category.name) {
                    category.fields.push(field);
                }
            });
        });

        this.fieldsByCategory = categories;
    }

    setupTinyMce() {
        this.ngZone.runOutsideAngular(() => {
            tinymce.remove();
            tinymce.init({
                selector: '#textarea',
                toolbar:
                    'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | shortcodes requiredShortcodes | table',
                plugins: 'table stylebuttons code paste',
                content_style: 'body { font-family: "Times New Roman", serif}',
                menu: {
                    file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                    view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                    insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough | styles blocks fontsize align lineheight | forecolor backcolor | language | removeformat' },
                    tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                    table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    help: { title: 'Help', items: 'help' },
                },
                paste_as_text: true,
                nonbreaking_force_tab: true,
                height: 700,

                setup: (editor) => {
                    if (this.isEdit) {
                        setTimeout(() => {
                            editor.setContent(this.template.content);
                        }, 1500);
                    }

                    editor.on('change', () => {
                        this.template.content = editor.getContent();
                        this.validateTiny(editor.getContent());
                    });

                    editor.ui.registry.addMenuButton('shortcodes', {
                        text: 'Optionele shortcodes',
                        fetch: (callback) => {
                            callback(this.createToolbarItems());
                        },
                    });

                    editor.ui.registry.addMenuButton('requiredShortcodes', {
                        text: 'Verplichte shortcodes',
                        fetch: (callback) => {
                            let requiredShortcodes: any = [
                                {
                                    type: 'nestedmenuitem',
                                    text: 'Verwerker',
                                    getSubmenuItems: () => [
                                        { type: 'menuitem', text: 'Naam', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-verwerker-naam}`); } },
                                        { type: 'menuitem', text: 'Baanpositie', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-verwerker-baan-positie}`); } },
                                        { type: 'menuitem', text: 'Oranisatie naam', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-organisatie-naam}`); } },
                                        { type: 'menuitem', text: 'Organisatie kvk', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-organisatie-kvk}`); } },
                                        { type: 'menuitem', text: 'Oranisatie adres', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-organisatie-adres}`); } },
                                        { type: 'menuitem', text: 'Organisatie postcode', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-organisatie-postcode}`); } },
                                        { type: 'menuitem', text: 'Organisatie plaats', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-organisatie-plaats}`); } },
                                        { type: 'menuitem', text: 'Organisatie land', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-organisatie-land}`); } },
                                    ]
                                },
                                {
                                    type: 'nestedmenuitem',
                                    text: 'Klant',
                                    getSubmenuItems: () => [
                                        { type: 'menuitem', text: 'Naam', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-klant-naam}`); } },
                                        { type: 'menuitem', text: 'Organisatie naam ', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-klant-organisatie-naam}`); } },
                                        { type: 'menuitem', text: 'Baanpositie', onAction: () => { tinymce.activeEditor!.insertContent(`{klant-baan-positie}`); } },
                                        { type: 'menuitem', text: 'Adres', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-klant-adres}`); } },
                                        { type: 'menuitem', text: 'Postcode', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-klant-postcode}`); } },
                                        { type: 'menuitem', text: 'Plaats', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-klant-plaats}`); } },
                                        { type: 'menuitem', text: 'Land', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-klant-land}`); } },
                                    ]
                                },
                                {
                                    type: 'nestedmenuitem',
                                    text: 'Info',
                                    getSubmenuItems: () => [
                                        { type: 'menuitem', text: 'Laatst aangepast door', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-laatst-aangepast-door}`); } },
                                        { type: 'menuitem', text: 'Laatst aangepast op', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-laatst-aangepast-op}`); } },
                                        { type: 'menuitem', text: 'Datum van signeren', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-gesigneerd-datum}`); } },
                                        { type: 'menuitem', text: 'Locatie van signeren', onAction: () => { tinymce.activeEditor!.insertContent(`{verplicht-gesigneerd-locatie}`); } },
                                    ]
                                }
                            ]
                            callback(requiredShortcodes);
                        }
                    });
                },
            });
        });
    }

    createToolbarItems(): any[] {
        let toolbarItems: any = [];

        this.fieldsByCategory.forEach((category) => {
            let fields: any = [];
            category.fields.forEach((field: IField) => {
                let f = {
                    type: 'menuitem',
                    text: field.name,
                    onAction: () => {
                        tinymce.activeEditor!.insertContent(
                            `{${field.shortcodeName}}`
                        );
                    },
                };
                fields.push(f);
            });

            let cat = {
                type: 'nestedmenuitem',
                text: category.name,
                getSubmenuItems: () => fields,
            };

            toolbarItems.push(cat);
        });
        return toolbarItems;
    }

    validateTiny(value: any) {
        if (value.length > 0) this.validTiny = true;
        else this.validTiny = false;
        this.validate();
    }

    useImage(event: any) {
        let file = event.target.files[0];
        const reader = new FileReader();
        this.toBase64(reader, file).then((result) => {
            this.imageBase64 = result;
            this.validate();
        });
    }

    changeName(event: any) {
        if (event.length > 0) this.validName = true;
        else this.validName = false;

        this.validate();
    }

    toBase64 = (fileReader: FileReader, file: any) =>
        new Promise((resolve, reject) => {
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });

    validate() {
        const btn = this.isEdit
            ? document.getElementById('templateUpdateBtn')
            : document.getElementById('templateCreateBtn');
        if (this.validName && this.validTiny && this.imageBase64 != undefined) {
            btn?.removeAttribute('disabled');
        } else {
            btn?.setAttribute('disabled', 'true');
        }
    }

    onSubmit() {
        if (this.imageBase64 != undefined)
            this.template.templateImage = this.imageBase64;

        if (this.isEdit) {
            this.templateService.editTemplate(this.template).subscribe(() => {
                this.router.navigate(['template']);
            });
        } else {
            if (
                !(this.imageBase64 == '') &&
                !(this.template.name == '') &&
                !(this.template.content == '')
            ) {
                this.templateService
                    .createTemplate(this.template)
                    .subscribe(() => {
                        this.router.navigate(['template']);
                    });
            }
        }
    }
}
