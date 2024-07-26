
/* 2024-07-19 rageInputEvent -> JQuery effectRange 변경  */
function effectRange(target) {
    $.each(target, function(index, item) {
        const gradient_value = 100 / $(item).attr('max');
        item.style.background = 'linear-gradient(to right, #008CF1 0%, #008CF1 '+gradient_value * $(item).val()
            +'%, #fff ' +gradient_value * $(item).val() + '%, #fff 100%)';
    })

}

/* 2024-07-22 상세검색 초기화 */
function setInitDetail() {
    $('input[name=detail_area]').prop('checked', false);
    $('input[id=detail_area-all]').prop('checked', true);
    $('input[name=detail_file]').prop('checked', false);
    $('input[id=detail_file-all]').prop('checked', true);

    $('input#detail_date-all').prop('checked', true);
    $('input[name=detail_sort][value="10"]').prop('checked', true);
}

/* 2024-07-22 상세조건 검색 버튼 클릭 시 상세조건과 필터 조건 동기화 */
function setFilterCondition() {
    // area
    if($('input[name=detail_area]:checked').length > 0) {
        $('input[name=filter_area]').prop('checked', false);
        $.each($('input[name=detail_area]:checked'), function(index, item) {
            $('input[name=filter_area][value="'+  $(item).val() +'"]').prop('checked', true);
        })

        addFilterAreaText();
    }

    // sort
    let detailSortValue = $('input[name=detail_sort]:checked').val();
    $('input[name=filter_sort][value="' +detailSortValue+ '"]').prop('checked', true);

    // date
    let detailDateValue = $('input[name=detail_date]:checked').val();
    if(detailDateValue !== "self") {
        $('input[name=filter_date]').val(detailDateValue);
        effectRange($('input[name=filter_date]'));
    }
}

function isNull(item) {
    if(!item) {
        return ''
    } else {
        return item
    }
}

function getEApprovalLink(dbPath, docId) {
    let frontUrl = "https://pt.phakr.com/egate/global/eip/home/home.nsf/openpage?readform&url=/";
    let viewCode = 0;
    let backUrl = "?opendocument&isundock=1";

    return frontUrl + dbPath + "/" + viewCode + "/" + docId + backUrl;
}

function addFilterAreaText() {
    let checkBoxAllCnt = $('input[name=filter_area][id!=filter_area-all]').length;
    let checkedCnt = $('input[name=filter_area][id!=filter_area-all]:checked').length;
    let areaText = '';

    if($('input[name=filter_area][value=AREA01]').prop('checked')) {
        areaText = '전체';
    } else if(checkBoxAllCnt !== checkedCnt) {
        $.each($('input[name=filter_area][value!=AREA01]:checked'), function(index, item) {
            if(index != 0) {
                areaText += ', '
            }
            areaText += $(item).siblings('label').text();
        })
    }

    $('div.select-box-area button.select-box-area__btn').text(areaText)
}

function initPagination() {
    $('input[name=selectedPage]').val(1);
}