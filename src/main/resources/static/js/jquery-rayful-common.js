
/* 2024-07-19 rageInputEvent -> JQuery effectRange 변경  */
function effectRange(target) {
    $.each(target, function(index, item) {
        const gradient_value = 100 / $(item).attr('max');
        item.style.background = 'linear-gradient(to right, #008CF1 0%, #008CF1 '+gradient_value * $(item).val()
            +'%, #fff ' +gradient_value * $(item).val() + '%, #fff 100%)';
    })

}

/* 상세검색 초기화 */
function setInitDetail() {
    let checkedFilterSort = $('input[name=filter_sort]:checked').val();
    let checkedFilterArea = $('input[name=filter_area]:checked');
    let checkedFilterDate = $('input[name=filter_date]').val();

    $('input[name=detail_sort]').prop('checked', false);
    $('input[name=detail_sort][value='+ checkedFilterSort +']').prop('checked', true);

    $('input[name=detail_area]').prop('checked', false);
    $.each(checkedFilterArea, function(index, item) {
        $('input[name=detail_area][value='+ $(item).val() +']').prop('checked', true);
    })

    $('input[name=detail_date][value='+ checkedFilterDate +']').prop('checked', true);

    $('input[name=detail_file]').prop('checked', false);
    $('input[id=detail_file-all]').prop('checked', true);

}

/* 상세조건 검색 버튼 클릭 시 상세조건과 필터 조건 동기화 */
function setFilterCondition() {
    // area
    if($('input[name=detail_area]:checked').length > 0) {
        $('input[name=filter_area]').prop('checked', false);
        $.each($('input[name=detail_area]:checked'), function(index, item) {
            $('input[name=filter_area][value="'+  $(item).val() +'"]').prop('checked', true);
        })

        updateAreaText();
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

    // attach
    $('input[name^=agg_]').prop('checked', false);
}

/* null 일 경우 빈 스트링을 반환한다. */
function ifNull(item) {
    if(!item) {
        return ''
    } else {
        return item
    }
}

/* 필터 검색 영역의 텍스트를 추가한다. */
function updateAreaText() {
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

/* 탭이동시 페이지를 초기화한다. */
function initPagination() {
    $('input[name=selectedPage]').val(1);
}

/* 첨부파일 확장자 클래스를 설정한다. */
function isEtcIcon(attachExt) {
    const iconList = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'txt', 'psd'];
    const ext = attachExt.toLowerCase();
    return iconList.includes(ext) ? ext : 'etc';
}

function isShowDetail(menuMap) {
    let selectedTap = getCurrentCollapseCd();

    if(menuMap[selectedTap].detail == 'N') {
        $('button.btn-detail-search').hide();
        $('div.total-search-detail__form').hide();
        $('button.tsd-more-btn').hide();
    } else {
        $('button.btn-detail-search').show();
        $('div.total-search-detail__form').show();
        $('button.tsd-more-btn').show();
    }
}

function getCurrentCollapseCd() {
    let selectedTap = $('div.total-menu ul').find('li.on').data('searchCollapseCd');
    if(selectedTap === undefined) {
        selectedTap = 99999;
    }

    return selectedTap;
}

function setCompanyInfo(companyName) {
    companyName = companyName.toLowerCase();
    let imagePath = '/assets/images/common/' + companyName + '_logo.png';
    let logoEle = $('h1.logo');
    logoEle.css('background-image', `url('${imagePath}')`);
}