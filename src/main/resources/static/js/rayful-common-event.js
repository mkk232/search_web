// 자동완성 Modal 닫기 이벤트
$('.btn-autoComplete-close').on('click', function() {
    let autoCompleteModal = $('div.input-control button.btn-setting');
    if(autoCompleteModal.hasClass('on')) {
        autoCompleteModal.removeClass('on');
        autoCompleteModal.addClass('off');
    }
})

// 상세검색 Modal 닫기 이벤트
$('.btn-detail-close').on('click', function() {
    let detailModal = $('header div.head-search div.search-form button.btn-detail-search');
    if(detailModal.hasClass('on')) {
        detailModal.removeClass('on');
        detailModal.addClass('off');
    }
})

// 기간 직접입력 Modal 열기/닫기 이벤트
$('div.total-search-detail__btn button.btn, button.filter_period-close-btn').on('click', function() {
    let periodModal = $('div.total-search-detail__btn button.btn');
    if(periodModal.hasClass('on')) {
        periodModal.removeClass('on');
        periodModal.addClass('off');
    } else {
        periodModal.removeClass('off');
        periodModal.addClass('on');
    }
})

// 상세검색 - Filter 정렬 클릭 이벤트
$('input[name=filter_sort], input[name=detail_sort]').on('change', function(e) {
    let checkedValue;
    if(e.target.name.startsWith('detail_')) {
        checkedValue = $('input[name=detail_sort]:checked').val();
        $('input[name=filter_sort][value=' + checkedValue + ']').prop('checked', true);
    } else if(e.target.name.startsWith('filter_')) {
        checkedValue = $('input[name=filter_sort]:checked').val();
        $('input[name=detail_sort][value=' + checkedValue + ']').prop('checked', true);
    }
})

// 상세검색 - Filter 검색 영역 클릭 이벤트
$('input[name=filter_area], input[name=detail_area]').on('change', function(e) {
    let checkedValue;
    if(e.target.name.startsWith('detail_')) {
        checkedValue = $('input[name=detail_area]:checked').val();
        $('input[name=filter_area]').prop('checked', false);
        $('input[name=filter_area][value=' + checkedValue + ']').prop('checked', true);
    } else if(e.target.name.startsWith('filter_')) {
        checkedValue = $('input[name=filter_area]:checked').val();
        $('input[name=detail_area][value=' + checkedValue + ']').prop('checked', true);
    }
})

// 상세검색 - Filter 기간 클릭 이벤트
$('input[name$=_date]').on('change', function(e) {
    let checkedDateValue = $(this).val();
    if(e.target.name.startsWith('detail_')) {
        $('input[type=range].rangeInput').val(checkedDateValue);
        effectRange($('input[type=range].rangeInput'));
    } else if(e.target.name.startsWith('filter_')) {
        $('input[name=detail_date]').val(checkedDateValue);
    }
})

// 상세검색 - Filter 기간 직접입력 이벤트
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

// 탭 클릭 이벤트
$('div.total-menu ul li').on('click', function() {
    if(!$(this).hasClass('on')) {
        $('div.total-menu ul li.on').removeClass('on');
        $(this).addClass('on');

        $('div.input-control button.search-btn').trigger('click');
    }
})

// Filter 클릭 이벤트
$('div.total-search-detail__content input[type=radio], div.total-search-detail__content input[type=range]')
                                                                .on('change', function() {
    $('div.input-control button.search-btn').trigger('click');
})

//  상세검색 - 첨부파일 체크박스 클릭 이벤트
$('input[name=detail_file]').on('change', function(e) {
    if($(this).attr('id') == 'file-all') {
        let checkAll = $(this).prop('checked');

        $.each($('input[name=detail_file]'), function(index, item) {
            $(item).prop('checked', checkAll);
        })
    } else {
        let checkBoxAllCnt = $('div.from-checkbox-group').find('input[name=detail_file][id!=file-all]').length;
        let checkedCnt = $('div.from-checkbox-group').find('input[name=detail_file][id!=file-all]:checked').length;
        if(checkBoxAllCnt == checkedCnt) {
            $('div.from-checkbox-group').find('input#file-all').prop('checked', true);
        } else {
            $('div.from-checkbox-group').find('input#file-all').prop('checked', false);
        }
    }
})

// 상세검색 - 키워드 입력 이벤트
$('.search-input').on('keyup', function() {
    $('.search-input').val($(this).val());
})

// 통합검색 - 더보기 클릭 이벤트
$(document).off().on('click', '.btn-icon-text__more' ,function() {

    let target = $('main.container section.content article');
    target.empty();

    $('div.total-menu ul li.on').removeClass('on');
    $('div.total-menu ul li[data-search-collapse-cd='+ $(this).data('searchCollapseCd') +']').trigger('click');
    // $('div.search-form .search-btn').trigger('click');
})

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
