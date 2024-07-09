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

// 기간 직접입력 Model 열기/닫기 이벤트
$('div.total-search-detail__btn button.btn, button.btn-period-close').on('click', function() {
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

// 상세검색 - Filter 영역 클릭 이벤트
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


// 첨부파일 미리보기 이벤트
$('button.btn-icon__preview, button.btn-preview-close').on('click', function() {
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

// Date to string format
function formatDateString(dateString) {
    if(dateString === undefined || dateString === null) {
        return dateString;
    }

    const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
    let d = new Date(dateString);

    let date = new Date(d.getTime() + TIME_ZONE).toISOString().split('T')[0];
    // let time = d.toTimeString().split(' ')[0];
    return date;
}