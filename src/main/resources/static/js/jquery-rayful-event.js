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

        /*let checkAll = $(this).prop('checked');
        if(!checkAll) {
            $('input[name='+ checkboxName +']').prop('checked', true);
            return;
        }

        $.each($('input[name=' + checkboxName + ']'), function(index, item) {
            $(item).prop('checked', checkAll);
        })*/
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

// 탭 클릭 이벤트
$('div.total-menu ul li').on('click', function() {
    initPagination();

    if(!$(this).hasClass('on')) {
        $('div.total-menu ul li.on').removeClass('on');
        $(this).addClass('on');

        $($('div.input-control button.search-btn')[0]).trigger('click');
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
    // $('div.btn-area button.btn-detail-close').trigger('click');
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

// Filter - 클릭 이벤트
/*$('div.total-search-detail__content input[type=radio], div.total-search-detail__content input[type=range]')
    .off().on('change', function() {
        $('div.head-search div.input-control button.search-btn').trigger('click');
    })*/


// Filter - 기간 직접입력 Modal 열기/닫기 이벤트
$('button[class$=_period-close-btn]').on('click', function() {
    let periodModalBtn = $('div.total-search-detail__btn button.btn');
    let periodModal = periodModalBtn.find('div.popup-wrap');
    if(periodModalBtn.hasClass('on')) {
        periodModal.hide();
        periodModalBtn.removeClass('on');
        periodModalBtn.addClass('off');
    } else {
        periodModal.show();
        periodModalBtn.removeClass('off');
        periodModalBtn.addClass('on');
    }
})

// Filter - 기간 직접입력 검색 이벤트
$('button.filter_period-search-btn').on('click', function(e) {
    initPagination();
    $('button.filter_period-close-btn.btn__darkgray--close').trigger('click');
    reqSearch(e);
})

// Filter - 정렬 클릭 이벤트 ( 동기화 )
$('input[name$=_sort][name!=detail_sort]').on('change', function(e) {
    initPagination();
    let checkedSortValue;
    checkedSortValue = $(this).val();
    $('input[name$=_sort][value=' + checkedSortValue + ']').prop('checked', true);
    // $('input[name=detail_sort-group][value=' + checkedSortValue + ']').prop('checked', true);
    reqSearch(e);
})

// Filter - 검색 영역 클릭 이벤트 ( 동기화 )
$('input[name=filter_area]').on('change', function() {
    initPagination();
    addFilterAreaText();

    // 상세검색과 동기화
    $.each($('input[name=filter_area]'), function(index, item) {
        let itemValue = $(item).val();
        let isChecked = $(item).prop('checked');
        $('input[name=detail_area][value='+ itemValue +']').prop('checked', isChecked);
    })

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
    if(e.target.name.startsWith('detail_')) {
        if(e.target.name.endsWith('start')) {
            $('input[name=filter_date-self-start]').val(selectedDate);
        } else {
            $('input[name=filter_date-self-end]').val(selectedDate);
        }
    } else if(e.target.name.startsWith('filter_')) {
        if(e.target.name.endsWith('start')) {
            $('input[name=detail_date-self-start]').val(selectedDate);
        } else {
            $('input[name=detail_date-self-end]').val(selectedDate);
        }
    }
})

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


// 상세검색 초기화 버튼 클릭 이벤트
$('div.box-detail div.btn-area button.btn-detail-reset').on('click', function() {
    setInitDetail();
})


// 상세검색 검색 영역 클릭 이벤트
$('input[name=detail_area]').on('change', function() {
    initPagination();

    if($(this).attr('id').endsWith('all')) {
        if(!$(this).prop('checked')) {
            $('input[name=detail_area]').prop('checked', true);
            return;
        }
    }
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
