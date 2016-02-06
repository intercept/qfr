function MakePage() {

    $.getJSON("http://verox.me/filestore/datax.json", function( data ) {
        var wrappers = [];
        var wrapperN = 0;
        $.each( data, function( key, val ) {
            try{
                wrappers.push(MakeWrapperInfo( key, val ));
                wrapperN += 1;
            }catch (ex){
                console.log(ex);
            }
        });
        $("#searchBox").attr("placeholder", "Search " + wrapperN + " wrappers...");
        $("#docu").append(wrappers);
        $("#searchBoxOCtr").show();

        if (location.hash != "")
        {
            var preSearchVal = window.location.hash.substring(1).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");;
            $("#searchBox").val(preSearchVal);
            doFilter(preSearchVal);
        }


        $('#searchBox').on('input', function() {
            var searchValue = $("#searchBox").val().trim();
            location.hash = searchValue;
            doFilter(searchValue);
        });
    } )
    .fail(function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        var realErrorText
        if (xhr.status == 200 || xhr.status == 0)
        {
            realErrorText = "The error was: " + status + ".";
        }
        else
        {
            realErrorText = "The server told us: " + xhr.status + " " + xhr.statusText + ".";
        }

        $("#docu").append("<div class=\"errorMessage\"><h1 class=\"errorTitle\">Oops, something went wrong. :(</h1><span class=\"errorDetail\">We couldn't load the wrapper data for some reason.<br />"+realErrorText+"</span></div>");
    })
    .always(function() {
        $("#loadingSpinner").hide();
    });
}

function PopulatePage(wrappers)
{

}

function MakeWrapperInfo( index, data )
{
    var rpr = "<div class=\"docuFnc\" data-sqf=\""+data.sqf+"\" data-intercept=\""+data.signature.name+"\" ><div class=\"docuFncContainer\">";

    // First we make the header.
    rpr += "<h1 class=\"docuFncHeader\">" + data.sqf + "<a href=\"https://community.bistudio.com/wiki/"+data.sqf+"\" class=\"biki\" target=\"_blank\">BIKI</a><span class=\"include\">#include \""+ data.include +"\"</span></h1>";
    rpr += "<div class=\"docuFncBody\">";

    // Then we make the description.
    rpr += "<div class=\"docuFncBodyDescr\">"+  data.description + "</div>";

    rpr += "<div class=\"docuFncBodyWrapper\">";

    // Then we make the signature.
    rpr += "<div class=\"docuFncBodyWrapperHeader\"><h3 class=\"docuFncBodyHeader\">Signature</h3><div class=\"docuFncBodyWrapperBody\"><span class=\"wrapperReturnType\">"+data.signature.return.type+"</span> "+data.signature.name+"("+MakeSignatureParameters(data.signature.params)+" );</div></div>"


    rpr += "<div class=\"docuFncBodyWrapperParameters\"><h3 class=\"docuFncBodyHeader\">Parameters</h3><div class=\"docuFncBodyWrapperBody\"><ul class=\"docuFncBodyWrapperParametersList\">";
    rpr += MakeListParams(data.signature.params);
    rpr += "</ul></div></div>";

    // if (data.signature.return.type != "void")
    // {
        rpr += "<div class=\"docuFncBodyWrapperReturnType\"><h3 class=\"docuFncBodyHeader\">Return</h3><div class=\"docuFncBodyWrapperBody\"><span class=\"wrapperReturnType\">"+data.signature.return.type+"</span> "+data.signature.return.description+"</div></div>";
    // }

    if ('notes' in data) {
        rpr += "<div class=\"docuFncBodyWrapperNotes\"><h3 class=\"docuFncBodyHeader\">Notes</h3><div class=\"docuFncBodyNotesBody\">"
        $.each(data.notes, function(data){
            rpr += data + "<br />";
        });
        rpr += "</div></div>";
    }

    rpr += "</div>";
    rpr += "</div></div></div>";

    return rpr;
}

function MakeSignatureParameters(params)
{
    var parameters = "";
    $.each(params, function(index, param) {
        parameters += " ";
        if (param.const == true)
            parameters += "<span class=\"wrapperParamConst\">const</span> ";

        parameters += param.type + " <span class=\"wrapperParamLabel\">"+param.label+"</span>";

        if (params.length != index +1)
            parameters += ",";
    });
    return parameters;
}

function MakeListParams(params)
{
    var parameters = "";
    $.each(params, function(index, param) {
        parameters += "<li><span class=\"wrapperReturnType\">"+param.type+"</span> <span class=\"wrapperParamLabel\">"+param.label+"</span> "+param.description+"</li>";
    });
    return parameters;
}

function doFilter(term) {
    var regexp = new RegExp(term, 'i');
    $("#docu").children().each(function() {
        if (regexp.test($(this).data("sqf")) || regexp.test($(this).data("intercept"))) {
            $(this).css('display', '');
            //$(this).show();
        }
        else {
            $(this).css('display', 'none');
            //$(this).hide();
        }
    })
}
