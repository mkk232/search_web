/*
 * 표준 UI에서 발생하는 이벤트를 정의한 파일
 *
 */

/* Main 이벤트 */

// 공통 checkbox 이벤트
$('input[type=checkbox]').on('click', function() {
    let checkboxName = $(this).attr('name');
    let checkBoxAllCnt = $('input[name='+ checkboxName +'][id!='+ checkboxName +'-all]').length;
    let checkedCnt = $('input[name='+ checkboxName +'][id!='+ checkboxName +'-all]:checked').length;

    if($(this).attr('id').endsWith('all')) {
        if($(this).prop('checked')) {
            $('input[name='+ checkboxName +']').prop('checked', false);
        }
        $(this).prop('checked', true);

    } else {
        if(checkBoxAllCnt == checkedCnt) {
            $('input[id='+ checkboxName +'-all]').prop('checked', true);
        } else if(checkedCnt == 0) {
            $(this).prop('checked', true);
        } else {
            $('input[id='+ checkboxName +'-all]').prop('checked', false);
        }
    }
})


// 키워드 입력 이벤트 ( 상세검색, 하단 검색 박스 동기화 )
$('.search-input').on('keyup', function() {
    $('.search-input').val($(this).val());
})

// 통합검색 - 더보기 클릭 이벤트
$(document).off().on('click', '.btn-icon-text__more' ,function() {
    let target = $('main.container section.content article');
    target.empty();

    $('div.total-menu ul li.on').removeClass('on');
    $('div.total-menu ul li[data-search-collapse-cd='+ $(this).data('searchCollapseCd') +']').trigger('click');
})

// 페이징 클릭 이벤트
$(document).on('click', 'div.paging-wrap button', function() {
    let selectedNo = $(this).data('pageNo');

    $('button.btn-num').removeClass('on');
    if(!$(this).hasClass('btn-next')) {
        $(this).addClass('on');
    }

    $('input[name=selectedPage]').val(selectedNo);
    reqSearch();
    $('html').scrollTop(0);
})

// 모바일 페이징 클릭 이벤트
$(document).on('click', 'button.btn-more-list', function(e) {
    let selectedNo = $(this).data('pageNo');
    $('input[name=selectedPage]').val(selectedNo);
    reqSearch(e);
})

$(document).on('click', 'div.doc-result-box h3 strong a', function() {
    const popupWidth = 1200;
    const popupHeight = 900;

    // 현재 브라우저 창의 크기
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // 팝업 창의 중앙 위치 계산
    let left = (screenWidth / 2) - (popupWidth / 2);
    let top = (screenHeight / 2) - (popupHeight / 2);

    let url = $(this).data('url');
    let option = `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`;
    let name = 'PHA'

    window.open(url, name, option);
})

$('input[type=range].rangeInput').on('click', function(e) {
    $('input[type=range].rangeInput').val(e.target.value);
    effectRange($('input[type=range].rangeInput'));
})


/* Main 이벤트 */


/* 검색 이벤트 */

// 검색 아이콘 클릭 이벤트
$('button[class$=search-btn]').on('click', function(e) {
    initPagination();
    reqSearch(e);
    let detailModal = $('header div.head-search div.search-form button.btn-detail-search');
    if(detailModal.hasClass('on')) {
        detailModal.removeClass('on');
        detailModal.addClass('off');
    }

    $('button.filter_period-close-btn.btn__darkgray--close').trigger('click');
})

// 검색창 엔터 이벤트
$('.search-input').on('keyup', function(key) {
    initPagination();

    if(key.keyCode == 13) {
        reqSearch();
        $('button.btn-detail-close').trigger('click');
    }
})

/* 검색 이벤트 */


/* 자동완성 이벤트 */

// 자동완성 Modal 닫기 이벤트
$('.btn-autoComplete-close').on('click', function() {
    let autoCompleteModal = $('div.input-control button.btn-setting');
    if(autoCompleteModal.hasClass('on')) {
        autoCompleteModal.removeClass('on');
        autoCompleteModal.addClass('off');
    }
})

/* 자동완성 이벤트 */


/* Filter 이벤트 */

// Filter - 기간 직접입력 Modal 열기/닫기 이벤트
$('button[class$=_period-close-btn]').on('click', function() {
    let periodModalBtn = $('div.total-search-detail__btn button.btn');
    let periodModal = periodModalBtn.find('div.popup-wrap');
    if(periodModalBtn.hasClass('on')) {
        periodModal.hide();
        periodModalBtn.removeClass('on');
        periodModalBtn.addClass('off');
    }
})

// Filter - 정렬 클릭 이벤트 ( 동기화 )
$('input[name$=_sort][name!=detail_sort]').on('change', function(e) {
    initPagination();
    let checkedSortValue;
    checkedSortValue = $(this).val();
    $('input[name$=_sort][value=' + checkedSortValue + ']').prop('checked', true);
    reqSearch(e);
})

// Filter - 검색 영역 클릭 이벤트 ( 동기화 )
$('input[name$=_area][name!=detail_area]').on('change', function() {
    let name = $(this).attr('name');
    initPagination();

    // 상세검색과 동기화
    $.each($('input[name='+ name +']'), function(index, item) {
        let itemValue = $(item).val();
        let isChecked = $(item).prop('checked');
        $('input[name$=_area][value='+ itemValue +']').prop('checked', isChecked);
    })

    updateAreaText();
    reqSearch();
})

// Filter - 기간 클릭 이벤트 ( 동기화 )
$('input[name$=_date][name!=detail_date]').on('change', function(e) {
    initPagination();
    let checkedDateValue = $(this).val();
    $('input[name$=_date][value=' + checkedDateValue + ']').prop('checked', true);

    reqSearch(e);
})

// Filter - 기간 직접입력 이벤트 ( 동기화 )
$('input[name$=_date-self-start], input[name$=_date-self-end]').on('change', function(e) {
    let selectedDate = $(this).val();
    let suffix = e.target.name.endsWith('start') ? 'start' : 'end';

    const updateInputs = (prefixes) => {
        prefixes.forEach(prefix => {
            $(`input[name=${prefix}_date-self-${suffix}]`).val(selectedDate);
        });
    };

    if (e.target.name.startsWith('detail_')) {
        updateInputs(['filter', 'mobile']);
    } else if (e.target.name.startsWith('filter_')) {
        updateInputs(['detail', 'mobile']);
    } else if (e.target.name.startsWith('mobile_')) {
        updateInputs(['filter', 'detail']);
    }

});

// Aggregation 클릭 이벤트
$(document).on('change', 'input[name^=agg_]', function() {
    initPagination();
    reqSearch();
})

/* Filter 이벤트 */


/* 상세검색 이벤트 */

// 상세검색 - Modal 닫기 이벤트
$('.btn-detail-close, .btn-detail-search').on('click', function() {
    let detailModal = $('header div.head-search div.search-form button.btn-detail-search');
    if(detailModal.hasClass('on')) {
        detailModal.removeClass('on');
        detailModal.addClass('off');
        setInitDetail();
    } else {
        detailModal.removeClass('off');
        detailModal.addClass('on');
    }

})

// 상세검색 - 초기화 버튼 클릭 이벤트
$('div.box-detail div.btn-area button.btn-detail-reset').on('click', function() {
    setInitDetail();
})


/* 상세검색 이벤트 */


// 첨부파일 미리보기 이벤트
/*
$(document).on('click', 'button.btn-icon__preview, button.btn-preview-close', function() {
    $(this).closest('div.file-download')
    let previewFileWrap = $(this).closest('div.item').find('div.file-wrap');
    let previewIcon = $(this).closest('div.item').find('button.btn-icon__preview');

    if(previewFileWrap.hasClass('on')) {
        previewIcon.removeClass('on');
        previewFileWrap.removeClass('on')
    } else {
        previewIcon.addClass('on')
        previewFileWrap.addClass('on')
    }
})
*/
