/*
 * 표준 UI 검색 결과를 출력해주는 함수들을 정의한 파일
 *
 */

function printSections(target, data) {
    // Aggregation 초기화
    let aggTarget = $('div.aggregation');
    aggTarget.empty();

    if(data.result.totalCnt > 0) {
        printSearchInfo(target, data.result);

        $.each(data.result.sectionList, function(index, section) {
            if(section.sectionCnt > 0) {
                printSectionHeader(target, section);

                if(section.sectionCode == 50000 && section.indexName == "idx_03_people") {
                    printPeople(target, section);
                } else {
                    printDocument(target, section);
                }
            }
        })

        let currentTabCd = getCurrentCollapseCd();
        if(currentTabCd != 99999) {
            printAggregation(aggTarget, data.result);
            printPagination(data.result.sectionList);
        }
    } else {
        printNoResult(target, data.result);
    }
}

function printDocument(target, data) {
    let sectionName = data.sectionName;
    let sectionCode = data.sectionCode;
    let docList = '';
    let collapseCd = getCurrentCollapseCd();


    $.each(data.docList, function(index, doc) {
        let attachList = '';
        /* 첨부파일 */

        $.each(doc.attach_info, function(index, attach) {
            attachList += $('<div />')
                .attr('data-attach-id', attach.attach_id)
                .addClass('file-download')
                .append(
                    $('<a />')
                        .attr('href', attach.view_downloadUrl)
                        .attr('target', '_blank')
                        .addClass(isEtcIcon(attach.attach_ext))
                        .html(DOMPurify.sanitize(attach.attach_nm_highlight ? attach.attach_nm_highlight : attach.attach_nm))
                )[0].outerHTML;
        })

        docList += $('<div />')
            .addClass('item')
            .append(
                $('<h3 />')
                    .append(
                        $('<strong />')
                            .append(
                                    $('<a />')
                                        .attr('data-url', doc.view_docLink)
                                        .addClass('color-third')
                                        .html(DOMPurify.sanitize(doc.title))
                            )
                    )
                    .append(
                        $('<span />')
                            .text(doc.category_full)
                    )
            )
            .append(
                $('<p />')
                    .addClass('txt')
                    .html(DOMPurify.sanitize(doc.view_content))
            )
            .append(
                attachList
            )
            .append(
                $('<div />')
                    .addClass('file-wrap')
                    .append(
                        $('<p />').text(doc.attach_body)
                    )
                    .append(
                        $('<div />')
                            .addClass('file-control')
                            .append(
                                $('<strong />').text('저작권 정보')
                            )
                            .append(
                                $('<button type="button" />')
                                    .addClass('btn-icon-text__download')
                                    .text('다운로드')
                            )
                            .append(
                                $('<button type="button" />')
                                    .addClass('btn-icon-text__close btn-preview-close')
                                    .text('닫기')
                            )
                    )
            )
            .append(
                $('<p />')
                    .addClass('text-date')
                    .html(DOMPurify.sanitize(isNull(doc.view_writer_nm) + '<b>|</b>' + doc.view_dtm))
            )[0].outerHTML;
    })

    // header
    /*printSectionHeader(target, sectionName);*/

    if(collapseCd !== 99999) {
        if(target.find('div.box-area__content').length > 0) {
            target.find('div.doc-result-box').append(
                docList
            )
            return;
        }
    }

    // body
    target.find('div.box-area[data-section-name='+sectionName+']')
        .append(
            $('<div />')
                .addClass('box-area__content')
                .append(
                    $('<div />')
                        .addClass('doc-result-box')
                        .append(
                            docList
                        )
                )
                .append(
                    collapseCd == '99999' ?
                        data.sectionCnt > 10 ? printMoreButton(sectionName, sectionCode) : ''
                        : ''
                )
        )
}

// 임직원 검색
function printPeople(target, data) {
    let sectionName = data.sectionName;
    let sectionCode = data.sectionCode;
    let collapseCd = getCurrentCollapseCd();

    let peopleList = '';
    $.each(data.docList, function(index, doc) {
        peopleList += $('<li />')
            .addClass('staff-item')
            .append(
                $('<div />')
                    .addClass('thumnail')
                    .append(
                        $('<div />')
                            .append(
                                $('<img />')
                                    .attr('src', doc.view_personImg)
                                    .attr('width', '100px')
                                    .attr('height', '128px')
                                    .attr('onerror', 'this.style.display="none"')
                            )
                            .addClass('thumnail__img')
                    )
                    .append(
                        $('<p />')
                            .addClass('thumnail__txt')
                            .append(
                                $('<span />').html(DOMPurify.sanitize(doc.person_nm))
                            )
                            .append(
                                $('<span />').html(DOMPurify.sanitize(doc.duty_nm))
                            )
                    )
            )
            .append(
                $('<ul />')
                    .addClass('staff-info')
                    .append(
                        $('<li />')
                            .addClass('staff-info__item')
                            .append(
                                $('<ul />')
                                    .append(
                                        $('<li />')
                                            .html(DOMPurify.sanitize('<strong>소속</strong> ' + doc.dept_nm))
                                    )
                                    .append(
                                        $('<li />')
                                            .html(DOMPurify.sanitize('<strong>담당업무</strong> ' + isNull(doc.responsibility)))
                                    )
                                    .append(
                                        $('<li />')
                                            .html(DOMPurify.sanitize('<strong>내선번호</strong> ' + doc.phone))
                                    )
                                    .append(

                                        $('<li />')
                                            .html(DOMPurify.sanitize('<strong>휴대폰</strong> ' + doc.cellphone))
                                    )
                                    .append(
                                        $('<li />')
                                            .html(DOMPurify.sanitize('<strong>이메일</strong> ' + doc.email))
                                    )
                            )
                    )
            )[0].outerHTML;
    })

    // header
    /*printSectionHeader(target, sectionName);*/

    if(collapseCd !== '99999') {
        if (target.find('div.staff-area').length > 0) {
            target.find('ul.staff-content').append(
                peopleList
            )
            return;
        }
    }

    // body
    target.find('div.box-area[data-section-name='+sectionName+']')
        .append(
            $('<div />')
                .addClass('staff-area')
                .append(
                    $('<ul />')
                        .addClass('staff-content')
                        .append(
                            peopleList
                        )
                )
                .append(
                    collapseCd == '99999' ?
                        data.sectionCnt > 5 ? printMoreButton(sectionName, sectionCode) : ''
                        : ''
                )
    )

}

function printAggregation(target, data) {
    let field = '';
    let li = '';
    $.each(data.sectionList[0].aggregations, function(index, aggregations) {
        if(aggregations !== undefined) {
            if(aggregations.buckets.length > 0) {
                field = aggregations.field;
                li = '';
                $.each(aggregations.buckets, function(itemIndex, item) {
                    li += $('<li />')
                        .append(
                            $('<input type="checkbox" />')
                                .attr('id', 'agg_' + field + '_' + item.key)
                                .attr('name', 'agg_' + field + '_' + item.key)
                                .val(item.key)
                        )
                        .append(
                            $('<label />')
                                .attr('for', 'agg_' +  field + '_' + item.key)
                                .text(item.key + ' (' + item.doc_count +')')
                        )[0].outerHTML;
                })

                target.append(
                    $('<dl />')
                        .attr('data-name', field)
                        .addClass(field)
                        .append(
                            $('<dt />')
                                .text(aggregations.name)
                        )
                        .append(
                            $('<dd />')
                                .append(
                                    $('<div />')
                                        .addClass('checkbox-group')
                                        .append(
                                            $('<ul />')
                                                .append(li)
                                        )
                                )
                        )
                        /*.append(
                            $('<div />')
                                .addClass('total-search-detail__btn')
                                .append(
                                    $('<button />')
                                        .addClass('btn search-btn')
                                        .text('적용')
                                )
                        )*/
                )
            }
        }
    })
}


function printPagination(data) {
    let resize = $('input[name=resize]').val();
    let defaultPageSize = pagination.defaultPageSize;
    let selectedPage = $('input[name=selectedPage]').val();
    if(selectedPage === undefined || selectedPage < 1) {
        selectedPage = 1;
    }

    let totalCnt = parseInt($(data)[0].sectionCnt);
    let maxPageCnt = totalCnt / defaultPageSize < 1 ? 1 : Math.ceil(totalCnt / defaultPageSize);

    let pageBlockSize = pagination.pageBlockSize;
    let pageBlockNo = Math.floor((selectedPage - 1) / pageBlockSize);

    let start = pageBlockNo * pageBlockSize + 1;
    let end = Math.min((start + pageBlockSize - 1), maxPageCnt);

    let buttons = '';

    let baseTarget = $('section.content article');
    if(resize == 'pc' || resize == 'tablet') {
        for (let index = start; index <= end; index++) {
            buttons += $('<button type="button" />')
                .addClass('btn-num')
                .addClass(selectedPage == index ? 'on' : '')
                .attr('data-page-no', index)
                .text(index)[0].outerHTML;
        }

        baseTarget.append(
            $('<div />')
                .addClass('paging-wrap')
                .append(
                    $('<div />')
                        .addClass('numbers')
                        .append(
                            buttons
                        )
                )
        )

        // prev
        if (pageBlockNo > 0) {
            baseTarget.find('div.paging-wrap')
                .prepend(
                    $('<button class="btn-prev"/>')
                        .attr('data-page-no', (pageBlockNo - 1) * pageBlockSize + 1)
                        .html(DOMPurify.sanitize('&lt;'))
                )
        }

        // next
        if (maxPageCnt >= (pageBlockNo + 1) * pageBlockSize + 1) {
            baseTarget.find('div.paging-wrap')
                .append(
                    $('<button class="btn-next"/>')
                        .attr('data-page-no', (pageBlockNo + 1) * pageBlockSize + 1)
                        .html(DOMPurify.sanitize('&gt;'))
                )
        }
    }

    let currentCnt = (pageBlockSize * selectedPage) >= totalCnt ? totalCnt : (pageBlockSize * selectedPage);
    let moreCnt = (totalCnt - currentCnt) > pagination.moreViewSize ? pagination.moreViewSize : (totalCnt - currentCnt)
    if(moreCnt > 0) {
        baseTarget.find('div.box-area')
            .append(
                $('<button />')
                    .addClass('btn-more-list')
                    .attr('data-page-no', parseInt(selectedPage) + 1)
                    .append(
                        $('<strong />').text(moreCnt + '건 더보기')
                    )
                    .append(
                        $('<span />').text('(' + currentCnt + '/' + totalCnt + ')')
                    )
            )
    }
}


function printMoreButton(sectionName, sectionCode) {
    return $('<div />')
        .addClass('more-info-area')
        .append(
            $('<a />')
                .addClass('btn-icon-text__more')
                .attr('data-search-collapse-cd', sectionCode)
                .text(sectionName + ' 더보기')
        )[0].outerHTML;
}

function printSearchInfo(target, data) {
    if($('input[name=resize]').val() != 'pc') {
        return;
    }
    let viewText = '';
    let prevKwd = data.prevKwd;
    if(prevKwd.length >= 1) {
        $.each(prevKwd, function(index, item) {
            if(item != '') {
                viewText += item;
                if(index != prevKwd.length - 1) {
                    viewText += ', ';
                }
            }
        })
    }

    if(viewText != '') {
        viewText += ', ';
    }

    viewText += data.kwd;

    let searchInfo = '<strong class="txt-keyword">' + viewText +'</strong> 에 대한 검색 결과';

    target.append(
        $('<div />')
            .addClass('tit-box result-box')
            .append(
                $('<h2 />')
                    .addClass('total-tit')
                    .html(
                        DOMPurify.sanitize(searchInfo)
                    )
            )
            .append(
                $('<p />')
                    .addClass('total-tit__info')
                    .append(
                        $('<strong />')
                            .addClass('txt-total')
                            .html(DOMPurify.sanitize('총 <span class="num">'+ data.totalCnt +'</span> 건'))
                    )
            )
    )
}

function printSectionHeader(target, data) {
    let collapseCd = getCurrentCollapseCd();

    /* 모바일 더보기 클릭 시 헤더 출력 방지 */
    if(collapseCd !== 99999 &&
        (target.find('div.staff-area').length > 0
        || target.find('div.box-area__content').length > 0)) {
        return;

    }
    let sectionName = data.sectionName;
    let sectionCode = data.sectionCode;
    let sectionCnt = data.sectionCnt;

    target.append(
        $('<div />')
            .addClass('box-area')
            .attr('data-section-name', sectionName)
            .append(
                $('<div />')
                    .addClass('box-area__tit')
                    .append(
                        $('<h2 />')
                            .addClass('box-tit')
                            .text(sectionName)
                            /*.append(
                                $('<button type="button" />')
                                    .addClass('btn-info')
                                    .text('정보')
                            )*/
                            .append(
                                $('<div />')
                                    .addClass('popup-wrap')
                                    .append(
                                        $('<button type="button" />')
                                            .addClass('btn-icon__close2')
                                            .text('닫기')
                                    )
                                    .append(
                                        $('<section />')
                                            .addClass('txt-wrap')
                                            .append(
                                                $('<p />')
                                                    .addClass('txt')
                                                    .text('카테고리에 대한 설명입니다. 카테고리에 대한 설명입니다.카테고리에 대한 설명입니다.')
                                            )
                                    )
                            )
                    )
                    .append(
                        collapseCd == '99999' ?
                            sectionCnt > 10 ?
                                $('<a href="#" />')
                                    .addClass('btn-icon-text__more')
                                    .attr('data-search-collapse-cd', sectionCode)
                                    .text(sectionName + ' 더보기')
                                : ''
                            : ''
                    )
            )
    )
}

function printNoResult(target, data) {
    let viewText = '';
    let prevKwd = data.prevKwd;
    if(prevKwd.length >= 1) {
        $.each(prevKwd, function(index, item) {
            if(item != '') {
                viewText += item;
                if(index != prevKwd.length - 1) {
                    viewText += ', ';
                }
            }
        })
    }

    if(viewText != '') {
        viewText += ', ';
    }

    viewText += data.kwd;

    let searchInfo = '<b>' + viewText +'</b> 에 대한 검색 결과가 없습니다.';

    target.append(
        $('<div />')
            .addClass('box-nodata')
            .append(
                $('<div />')
                    .addClass('box-nodata__header')
                    .append(
                        $('<p />')
                            .addClass('tit')
                            .html(DOMPurify.sanitize(searchInfo))
                    )
            )
            .append(
                $('<article />')
                    .addClass('box-nodata__content')
                    .append(
                        $('<ul />')
                            .addClass('info-list circle')
                            .append(
                                $('<li />').text('단어의 철자가 정확한지 확인해 보세요.')
                            )
                            .append(
                                $('<li />').text('검색어가 바르게 입력되었는지 확인해 보세요.')
                            )
                            .append(
                                $('<li />').text('비슷한 단어로 다시 검색해 보세요.')
                            )
                    )
            )
    )
}

function printNoKeyword() {
    let target = $('main.container section.content article');
    target.empty();

    target.append(
        $('<div />')
            .addClass('box-nodata')
            .append(
                $('<div />')
                    .addClass('box-nodata__header')
                    .append(
                        $('<p />')
                            .addClass('tit')
                            .text('검색할 키워드가 없습니다.')
                    )
            )
            .append(
                $('<article />')
                    .addClass('box-nodata__content')
                    .append(
                        $('<ul />')
                            .addClass('info-list circle')
                            .append(
                                $('<li />').text('찾고자하는 검색어를 입력하시고, 검색 버튼을 눌러주세요.')
                            )
                    )
            )
    )
}


