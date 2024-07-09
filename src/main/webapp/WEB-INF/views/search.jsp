<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rayful System</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <script src="/js/lib/jquery.min.3.7.1.js"></script>
    <script defer src="/js/rayful-common-event.js"></script>
    <script defer src="/js/rayful-print-section.js"></script>

</head>
<style>
    em {
        font-weight: bold;
        /*margin-top: 7px;*/
        line-height: 2.0rem;
        font-size: 1.4rem;
        text-overflow: ellipsis;
        overflow: hidden;
        /*display: -webkit-box;*/
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>

<script type="text/javascript">
    $(document).ready(function() {

        // TODO -

        // TODO - 페이지 로드 시 기간 range 설정 필요
        $('input[type=range].rangeInput').val(4);

        // TODO - 배포 시 삭제
        reqSearch();

        // 검색 아이콘 클릭 이벤트
        $('.search-btn').on('click', function(e) {
            reqSearch(e);
            $('button.btn-detail-close').trigger('click');
        })

        // 검색창 엔터 이벤트
        $('.search-input').on('keyup', function(key) {
            // reqAutoComplete();

            if(key.keyCode == 13) {
                reqSearch();
                $('button.btn-detail-close').trigger('click');
            }
        })

        // Filter - 기간 직접입력 검색 이벤트
        $('button.filter_period-search-btn').on('click', function(e) {
            $('button.filter_period-close-btn.btn__darkgray--close').trigger('click');
            reqSearch(e);
        })

        // 검색 API 호출
        function reqSearch(e) {
            let searchKeyword = $('.search-input').val();

            if(e !== undefined) {
                if(e.isTrigger === 3) {
                    searchKeyword = $('input[name=kwd]').val();
                }
            }

            if(searchKeyword.trim() == '') {
                printNoKeyword();
                return;
            }

            let sendData = {
                kwd: searchKeyword,
                srchArea: $('input[name=detail_area]:checked').val(),
                collapseCd: $('div.total-menu ul li.on').data('searchCollapseCd'),
                size: 10,
                sort: $('input[name=detail_sort]:checked').val(),
                page: 1,
                reSrchYn: 'N',
                prevKwd: [''],
                period : $('div.date-range input[type=range]').val()
            }

            // 결과 내 재검색
            if($('input#research').prop('checked')) {
                if($('input[name=kwd]').val() != searchKeyword) {
                    if($('input[name=prevKwd]').val() != '') {
                        $('input[name=prevKwd]').val($('input[name=prevKwd]').val() + ',' +$('input[name=kwd]').val());
                    } else {
                        $('input[name=prevKwd]').val($('input[name=kwd]').val());
                    }
                }

                $('input[name=kwd]').val($('input[name=prevKwd]').val());

                sendData['reSrchYn'] = 'Y';

                let prevKwdList = [];
                $.each($('input[name=prevKwd]').val().split(","), function(index, item) {
                    prevKwdList.push(item);
                })

                sendData['prevKwd'] = prevKwdList;
            } else {
                $('input[name=prevKwd]').val('');
            }
            $('input[name=kwd]').val(searchKeyword);

            // 첨부파일
            let attachType = '';
            if(!($('input#file-all').prop('checked'))) {
                $.each($('input[name=detail_file]:checked'), function(index, item) {
                    attachType += $(item).val();
                    if(!(index == $('input[name=detail_file]:checked').length - 1)) {
                        attachType += "###";
                    }
                })

                sendData['attachedType'] = attachType;
            }

            // 필터 기간 직접입력 검색
            if(e !== undefined ) {
                if(e.target.className.includes('filter_period-search-btn')) {
                    let endDtm = $('input[name=detail_date-self-end]').val();
                    let startDtm = $('input[name=detail_date-self-start]').val();
                    if (startDtm === '') {
                        return;
                    }
                    sendData['regDtmYn'] = 'Y';
                    sendData['regStartDtm'] = startDtm;
                    sendData['regEndDtm'] = endDtm;
                }
            }

            console.log(sendData);

            $('main.container section.content article').empty();
            $.ajax({
                url: '/search.json',
                type: 'POST',
                data: JSON.stringify(sendData),
                contentType: 'application/json; charset=utf-8',
                timeout: 10000,
                success: function(data) {
                    printSections(data.result);
                },
                error: function (data, xhr, responseText) {
                    if(data.responseText.status == 1) {

                    }
                }
            })
        }
    })



// 자동완성 API 호출
function reqAutoComplete() {
    let keyword = $('.search-input').val();
}

function printSections(data) {
    let target = $('main.container section.content article')
   // target.empty();

    if(data.result.totalCnt > 0) {
        printSearchInfo(target, data.result);
        $.each(data.result.sectionList, function(index, data) {
            if(data.sectionCnt > 0) {
                if(data.sectionCode == 10000 && data.indexName == "idx_01_edms") {
                    printEapproval(target, data);
                } else if(data.sectionCode == 20000 && data.indexName == "idx_02_eapproval") {
                    printEapproval(target, data);
                } else if(data.sectionCode == 40000 && data.indexName == "idx_02_regulation") {
                    printEapproval(target, data);
                } else if(data.sectionCode == 50000 && data.indexName == "idx_03_people") {
                    printPeople(target, data);
                }

            }
        })

        let currentTabCd = $('div.total-menu ul li.on').data('searchCollapseCd');
        if(currentTabCd == 99999 || currentTabCd == 10000 || currentTabCd == 20000 || currentTabCd == 40000) {
            console.log("call printAggregation");
            printAggregation(data.result);
        }

    } else {
        printNoResult(target, data.result);
    }

}

</script>
<body>
    <div class="wrap">
        <!-- header -->
        <header>
            <div class="head-info">
                <h1 class="logo">payful system</h1>
                <button type="button" class="tip">도움말</button>
            </div>
            <div class="head-search">
                <div class="search-form">
                    <div class="input-control">
                        <input class="search-input" type="text" value=""/>
                        <input type="hidden" name="kwd" />
                        <input type="hidden" name="prevKwd" />
                        <button type="button" class="btn-setting">검색 세팅</button>

                    <!-- 자동완성 -->
                    <div class="box-setting">
                        <ul>
                            <li>
                                <button type="button"><b>검색</b> 설정</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>기록삭제</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b></button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>기록</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>엔진</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>광고마케터</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>기록확인</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>엔진순위</button>
                            </li>
                            <li>
                                <button type="button"><b>검색</b>어 트렌드</button>
                            </li>
                        </ul>
                        <div class="box-setting__buttom">
                            <div class="area">
                                <button type="button">첫단어 보기</button>
                                <span class="circle"></span>
                                <button type="button">끝단어 보기</button>
                            </div>

                            <button class="close btn-autoComplete-close">닫기</button>
                        </div>
                    </div>
                    <button type="submit" class="btn-icon__search search-btn">검색</button>
                </div>
                <button class="btn-detail-search">상세검색</button>
                <!-- 자동완성 -->

                <!-- 상세검색 Modal -->
                <div class="box-detail">
                    <button type="button" class="btn-icon__close btn-detail-close">닫기</button>
                    <dl class="first">
                        <dt>키워드</dt>
                        <dd>
                            <div class="input-control">
                                <input type="text" value="입력" />
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>영역</dt>
                        <dd>
                            <div class="from-radio-group">
                                <div class="radio">
                                    <input id="detail_area-all" type="radio" name="detail_area" value="AREA01" checked />
                                    <label for="detail_area-all">전체</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_area-title" type="radio" name="detail_area" value="AREA02"/>
                                    <label for="detail_area-title">제목</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_area-title-content" type="radio" name="detail_area" value="AREA03"/>
                                    <label for="detail_area-title-content">제목+본문</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_area-attach" type="radio" name="detail_area" value="AREA04"/>
                                    <label for="detail_area-attach">첨부</label>
                                </div>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>기간</dt>
                        <dd>
                            <div class="from-radio-group">
                                <div class="radio">
                                    <input id="detail_date-all" type="radio" name="detail_date" checked />
                                    <label for="detail_date-all">전체</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_date-day" type="radio" name="detail_date"/>
                                    <label for="detail_date-day">1일</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_date-week" type="radio" name="detail_date"/>
                                    <label for="detail_date-week">1주일</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_date-month" type="radio" name="detail_date"/>
                                    <label for="detail_date-month">1개월</label>
                                </div>
                            </div>
                            <div class="dir-date-input">
                                <div class="radio">
                                    <input id="detail_date-self" type="radio" name="detail_date"/>
                                    <label for="detail_date-self">기간 입력</label>
                                </div>
                                <div class="date-picker__period">
                                    <input type="date" name="detail_date-self-start" />
                                    <span class="dash">~</span>
                                    <input type="date" name="detail_date-self-end" />
                                </div>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>정렬</dt>
                        <dd>
                            <div class="from-radio-group">
                                <div class="radio">
                                    <input id="detail_sort-relevant" type="radio" name="detail_sort" value="10" checked />
                                    <label for="detail_sort-relevant">정확도</label>
                                </div>
                                <div class="radio">
                                    <input id="detail_sort-latest" type="radio" name="detail_sort" value="20"/>
                                    <label for="detail_sort-latest">최신순</label>
                                </div>
                            </div>
                        </dd>
                    </dl>
                    <dl class="last">
                        <dt>첨부파일</dt>
                        <dd>
                            <div class="from-checkbox-group">
                                <div class="checkbox">
                                    <input id="file-all" type="checkbox" name="detail_file" value="ATTACHED00" checked />
                                    <label for="file-all">전체</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-hwp" type="checkbox" name="detail_file" value="ATTACHED01" checked />
                                    <label for="file-hwp">아래한글</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-doc" type="checkbox" name="detail_file" value="ATTACHED02" checked />
                                    <label for="file-doc">워드</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-ppt" type="checkbox" name="detail_file" value="ATTACHED03" checked />
                                    <label for="file-ppt">파워포인트</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-xls" type="checkbox" name="detail_file" value="ATTACHED04" checked />
                                    <label for="file-xls">엑셀</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-pdf" type="checkbox" name="detail_file" value="ATTACHED05" checked />
                                    <label for="file-pdf">pdf</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-txt" type="checkbox" name="detail_file" value="ATTACHED06" checked />
                                    <label for="file-txt">텍스트</label>
                                </div>
                                <div class="checkbox">
                                    <input id="file-besides" type="checkbox" name="detail_file" value="ATTACHED99" checked />
                                    <label for="file-besides">기타</label>
                                </div>
                            </div>
                        </dd>
                    </dl>
                    <div class="btn-area">
                        <button class="btn__blue--search search-btn">검색</button>
                        <button class="btn__navy--reset btn-detail-reset">초기화</button>
                        <button class="btn__darkgray--close btn-detail-close">취소</button>
                    </div>

                </div>
                <!-- 상세검색 Modal -->

                </div>

                <div class="research-form">
                    <input id="research" type="checkbox" />
                    <label for="research">결과 내 재검색</label>
                </div>
            </div>
        </header>

        <!-- 검색 영역-->
        <section class="search-terms">

            <!-- 관련어 -->
            <div class="related-wrap" style="display: none;">
                <button type="button" class="btn-related">열기/닫기</button>
                <div class="related-container">
                    <strong class="tit">관련어</strong>
                    <div class="related-list">
                        <button type="button">Microgrid platform</button>
                        <button type="button">영림원소프트</button>
                        <button type="button">Rayful System</button>
                        <button type="button">관련어 목록1</button>
                        <button type="button">관련어 목록2</button>
                        <button type="button">관련어 목록3</button>
                        <button type="button">관련어1</button>
                        <button type="button">관련어2</button>
                        <button type="button">관련어3</button>
                        <button type="button">관련어4</button>
                        <button type="button">관련어 목록1</button>
                        <button type="button">관련어 목록2</button>
                        <button type="button">관련어 목록3</button>
                        <button type="button">Microgrid platform</button>
                        <button type="button">영림원소프트</button>
                        <button type="button">Rayful System</button>
                        <button type="button">관련어 목록1</button>
                        <button type="button">관련어 목록2</button>
                        <button type="button">관련어 목록3</button>
                        <button type="button">관련어1</button>
                        <button type="button">관련어2</button>
                        <button type="button">관련어3</button>
                        <button type="button">관련어4</button>
                        <button type="button">관련어 목록1</button>
                        <button type="button">관련어 목록2</button>
                        <button type="button">관련어 목록3</button>
                        <button type="button">Microgrid platform</button>
                        <button type="button">영림원소프트</button>
                        <button type="button">Rayful System</button>
                        <button type="button">관련어 목록1</button>
                        <button type="button">관련어 목록2</button>
                        <button type="button">관련어 목록3</button>
                        <button type="button">관련어1</button>
                        <button type="button">관련어2</button>
                        <button type="button">관련어3</button>
                        <button type="button">관련어4</button>
                        <button type="button">관련어 목록1</button>
                        <button type="button">관련어 목록2</button>
                        <button type="button">관련어 목록3</button>
                    </div>
                </div>
            </div>
            <!-- 관련어 -->


            <ul class="search-terms__tab">
                <li class="total-wrap">
                    <button type="button" class="total-wrap__btn">통합검색</button>
                    <!-- 통합검색 -->
                    <div class="total-menu">
                        <ul>
                            <li class="on" data-search-collapse-cd="99999">
                                <button type="button" class="icon01">
                                    <span>통합검색</span>
                                </button>
                            </li>
                            <li data-search-collapse-cd="10000">
                                <button type="button" class="icon04">
                                    <span>문서관리</span>
                                </button>
                            </li>
                            <li data-search-collapse-cd="20000">
                                <button type="button" class="icon04">
                                    <span>전자결재</span>
                                </button>
                            </li>
                            <li data-search-collapse-cd="40000">
                                <button type="button" class="icon04">
                                    <span>사규</span>
                                </button>
                            </li>
                            <li data-search-collapse-cd="50000">
                                <button type="button" class="icon02">
                                    <span>직원검색</span>
                                </button>
                            </li>
                            <%--
                            <li data-collapse-cd="60000">
                                <button type="button" class="icon03">
                                    <span>사이트</span>
                                </button>
                            </li>
                            <li>
                                <button type="button" class="icon05">
                                    <span>게시판</span>
                                </button>
                            </li>
                            <li>
                                <button type="button" class="icon06">
                                    <span>포털검색</span>
                                </button>
                            </li>
                            <li>
                                <button type="button" class="icon07">
                                    <span>이미지</span>
                                </button>
                            </li>
                            --%>
                        </ul>
                    </div>

                    <!-- PC: 검색 더보기 (통합검색, 직원검색, 사이트 ... ) -->
                    <!-- PC 버전 Filter -->
                    <div class="total-search-detail">
                        <button type="button" class="tsd-more-btn">더보기</button>
                        <div class="total-search-detail__form">
                            <div class="total-search-detail__content">
                                <dl>
                                    <dt>정렬</dt>
                                    <dd>
                                        <div class="radio-group">
                                            <input id="filter_sort-relevant" type="radio" name="filter_sort" value="10" checked />
                                            <label for="filter_sort-relevant">정확도</label>
                                            <input id="filter_sort-latest" type="radio" name="filter_sort" value="20"/>
                                            <label for="filter_sort-latest">최신순</label>
                                        </div>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>영역</dt>
                                    <dd>
                                        <div class="radio-group">
                                            <input id="filter_area-all" type="radio" name="filter_area" value="AREA01" checked/>
                                            <label for="filter_area-all">전체</label>
                                            <input id="filter_area-title" type="radio" name="filter_area" value="AREA02"/>
                                            <label for="filter_area-title">제목</label>
                                        </div>
                                    </dd>
                                </dl>
                                <dl class="period">
                                    <dt>기간</dt>
                                    <dd>
                                        <div class="range-wrap">
                                            <ul class="range-values">
                                                <li>1일</li>
                                                <li>1주</li>
                                                <li>1달</li>
                                                <li>1년</li>
                                                <li>전체</li>
                                            </ul>
                                            <div class="date-range">
                                                <%-- value: 0 ~ 4 / 0: day, 1: week..... --%>
                                                <input type="range" class="rangeInput" value="0" id="date-01" min="0" max="4" />
                                            </div>
                                        </div>
                                        <div class="total-search-detail__btn">
                                            <button class="btn">직접입력</button>
                                            <div class="popup-wrap" style="top: 35px;">
                                                <button type="button" class="btn-icon__close2 filter_period-close-btn">닫기</button>
                                                <div class="header">
                                                    <h2>기간</h2>
                                                </div>
                                                <section>
                                                    <div class="date-picker__period">
                                                        <input type="date" name="filter_date-self-start" />
                                                        <span class="dash">~</span>
                                                        <input type="date" name="filter_date-self-end" />
                                                    </div>
                                                </section>
                                                <div class="btn-area">
                                                    <button class="btn__blue--search filter_period-search-btn">검색</button>
                                                    <button class="btn__darkgray--close filter_period-close-btn">닫기</button>
                                                </div>
                                            </div>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                            <div class="bottom-reset">
                                <button type="button" class="btn-reset">전체 초기화</button>
                            </div>
                        </div>
                    </div>
                    <!-- PC 버전 Filter -->

                </li>

                <!-- 인기 검색어 (비활성화) -->
                <li class="popular-wrap" style="display: none;">
                    <button type="button" class="popular-wrap__btn">인기 검색어</button>
                    <div class="popular-list">
                        <div class="popular-list__container">
                            <ol class="popular-list__content" style="transform: translateX(0px);">
                                <li>
                                    <a href="#">
                                        <span class="num">1</span>
                                        <span class="txt">액트지오 아브레우 박사 액트지오 아브레우 박사 액트지오 아브레우 박</span>
                                        <span class="ranking up auto">5</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">2</span>
                                        <span class="txt">김용진 뉴스타파 대표</span>
                                        <span class="ranking down auto">1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">3</span>
                                        <span class="txt">밀양 가해자 볼보</span>
                                        <span class="ranking up auto">5</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">4</span>
                                        <span class="txt">원 구성 모레까지</span>
                                        <span class="new-txt auto">New</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">5</span>
                                        <span class="txt">쿠에바스 두산</span>
                                        <span class="ranking up auto">1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">6</span>
                                        <span class="txt">쿠에바스 두산</span>
                                        <span class="ranking auto">-</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">7</span>
                                        <span class="txt">쿠에바스 두산</span>
                                        <span class="ranking up auto">1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">8</span>
                                        <span class="txt">쿠에바스 두산</span>
                                        <span class="ranking up auto">1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">9</span>
                                        <span class="txt">쿠에바스 두산</span>
                                        <span class="ranking up auto">1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="num">10</span>
                                        <span class="txt">쿠에바스 두산</span>
                                        <span class="ranking up auto">1</span>
                                    </a>
                                </li>
                            </ol>   
                        </div>
                        <div class="btn-more-link next on">
                            <a href="#">6~10위</a>
                        </div>
                        <div class="btn-more-link prev">
                            <a href="#">1~5위</a>
                        </div>
                    </div>
                </li>
                <!-- 인기 검색어 (비활성화) -->

            </ul>
            
            <!-- Mobile, Tablet: 검색 더보기 (통합검색, 직원검색, 사이트 ... ) -->
            <!-- Mobile 상세검색 -->
            <div class="total-search-detail">
                <button type="button" class="tsd-more-btn on">더보기</button>
                <div class="total-search-detail__form">
                    <div class="total-search-detail__content">
                        <dl>
                            <dt>정렬</dt>
                            <dd>
                                <div class="radio-group">
                                    <input id="mobile_relevant_mobile" type="radio" checked name="mobile_sort-group"/>
                                    <label for="mobile_relevant_mobile">정확도</label>
                                    <input id="mobile_latest_mobile" type="radio" name="mobile_sort-group"/>
                                    <label for="mobile_latest_mobile">최신순</label>
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>영역</dt>
                            <dd>
                                <div class="radio-group">
                                    <input id="mobile_area-all" type="radio" checked name="mobile_area-group"/>
                                    <label for="mobile_area-all">전체</label>
                                    <input id="mobile_area-title" type="radio" name="mobile_area-group"/>
                                    <label for="mobile_area-title">제목</label>
                                </div>
                            </dd>
                        </dl>
                        <dl class="period">
                            <dt>기간</dt>
                            <dd>
                                <div class="range-wrap">
                                    <ul class="range-values">
                                        <li>1일</li>
                                        <li>1주</li>
                                        <li>1달</li>
                                        <li>1년</li>
                                        <li>전체</li>
                                    </ul>
                                    <div class="date-range">
                                        <input type="range" class="rangeInput" value="0" id="mobile_date-range" min="0" max="4" />
                                    </div>
                                </div>
                                <div class="total-search-detail__btn">
                                    <button class="btn">직접입력</button>
                                    <div class="popup-wrap">
                                        <button type="button" class="btn-icon__close2 mobile_period-close-btn">닫기</button>
                                        <div class="header">
                                            <h2>기간</h2>
                                        </div>
                                        <section>
                                            <div class="date-picker__period">
                                                <input type="date" name="mobile_date-self-start" />
                                                <span class="dash">~</span>
                                                <input type="date" name="mobile_date-self-end" />
                                            </div>
                                        </section>
                                        <div class="btn-area">
                                            <button class="btn__blue--search">검색</button>
                                            <button class="btn__darkgray--close mobile_period-close-btn">닫기</button>
                                        </div>
                                    </div>
                                </div>
                            </dd>
                        </dl>
                    </div>
                    <div class="bottom-reset">
                        <button type="button" class="btn-reset">전체 초기화</button>
                    </div>
                </div>
            </div>
            <!-- Mobile 상세검색 -->

        </section>

        <!-- container -->
        <main class="container">
            <section class="content">
                <article>
                    <div class="tit-box result-box" style="display: none;">
                        <h2 class="total-tit">
                            <strong class="txt-keyword">키워드</strong> 에 대한 검색 결과
                        </h2>
                        <p class="total-tit__info">
                            <strong class="txt-total">총 <span class="num">143</span>건</strong> (pdf 1건 / doc 100건 / xls 12건 )
                        </p>
                    </div>

                    <div class="box-area" style="display: none;">
                        <div class="box-area__tit">
                            <h2 class="box-tit">
                                사이트 
                                <button type="button" class="btn-info">정보</button>
                                <div class="popup-wrap" style="display: none;">
                                    <button type="button" class="btn-icon__close2">닫기</button>
                                    <section class="txt-wrap">
                                        <p class="txt">카테고리에 대한 설명입니다. 카테고리에 대한 설명입니다.카테고리에 대한 설명입니다.</p>
                                    </section>
                                </div>
                            </h2>
                            <a href="#" class="btn-icon-text__more">사이트 더보기</a>
                        </div>
                        <div class="box-area__content">
                            <ul class="result-list">
                                <li><span class="dot">&#183;</span> 회사 &#62; IT 기업 &#62; <a href="#">레이풀 시스템</a></li>
                                <li><span class="dot">&#183;</span> 회사 &#62; 사람인 &#62; IT 기업 &#62; <a href="#">레이풀 시스템</a></li>
                                <li><span class="dot">&#183;</span> 회사 &#62; IT 기업 &#62; <a href="#">레이풀 시스템</a></li>
                                <li><span class="dot">&#183;</span> 회사 &#62; IT 기업 &#62; <a href="#">레이풀 시스템</a></li>
                                <li><span class="dot">&#183;</span> 회사 &#62; 사람인 &#62; IT 기업 &#62; <a href="#">레이풀 시스템</a></li>
                                <li><span class="dot">&#183;</span> 회사 &#62; IT 기업 &#62; <a href="#">레이풀 시스템</a></li>
                            </ul>

                            <div class="search-result-box">
                                <div class="item">
                                    <h3><a class="color-third" href="#">레이풀 시스템</a> <a href="#">www.rayful.com</a></h3>
                                    <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는2줄을 기본으로 합니다. 검색된 정보의 내용을 보여줍니다. 내용 줄수는2줄을 기본으로 합니...</p>
                                    <p class="result-list__item"><span class="dot">&#183;</span> 회사  &#62; IT 기업 &#62; 영림원소프트</p>
                                </div>
                                <div class="item">
                                    <h3><a class="color-third" href="#">레이풀 시스템</a> <a href="#">www.rayful.com</a></h3>
                                    <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는2줄을 기본으로 합니다. 검색된 정보의 내용을 보여줍니다. 내용 줄수는2줄을 기본으로 합니...</p>
                                    <p class="result-list__item"><span class="dot">&#183;</span> 회사  &#62; IT 기업 &#62; 영림원소프트</p>
                                </div>
                                <div class="item">
                                    <h3><a class="color-third" href="#">레이풀 시스템</a> <a href="#">www.rayful.com</a></h3>
                                    <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는2줄을 기본으로 합니다. 검색된 정보의 내용을 보여줍니다. 내용 줄수는2줄을 기본으로 합니...</p>
                                    <p class="result-list__item"><span class="dot">&#183;</span> 회사  &#62; IT 기업 &#62; 영림원소프트</p>
                                </div>
                            </div>
                            <div class="more-info-area">
                                <a href="#" class="btn-icon-text__more">문서관리 더보기</a>
                            </div>
                        </div>
                    </div>



                    <div class="box-area" style="display: none;">
                        <div class="box-area__tit">
                            <h2 class="box-tit">
                                문서관리 
                                <button type="button" class="btn-info">정보</button>
                                <div class="popup-wrap">
                                    <button type="button" class="btn-icon__close2">닫기</button>
                                    <section class="txt-wrap">
                                        <p class="txt">카테고리에 대한 설명입니다. 카테고리에 대한 설명입니다.카테고리에 대한 설명입니다.</p>
                                    </section>
                                </div>
                            </h2>
                            <a href="#" class="btn-icon-text__more">문서관리 더보기</a>
                        </div>
                        <div class="box-area__content">
                            <div class="doc-result-box">
                                <div class="item">
                                    <h3>
                                        <strong><a class="color-third" href="#">&#91;문서 일반&#93; 컨텐츠 제목</a></strong>
                                        <span>자료실 &#62; 문서 일반</span>
                                    </h3>
                                    <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는3줄을 기본으로 합니다. 키워드는 볼드 처리합니다. 3줄을 넘을 때는 ... 처리합니다. 검색된 정보의 내용을 보여줍니다. 내용 줄수는3줄을 기본으로 합니다. 키워드는 볼드 처리합니다. 3...</p>
                                    <div class="file-download">
                                        <a href="#" class="doc">첨부문서.doc</a>
                                        <button type="button" class="btn-icon__preview on">파일 찾기</button>
                                    </div>
                                    <div class="file-wrap on">
                                        <p>첨부파일의 내용을 텍스트로 보여줍니다. 첨부파일의 내용을 텍스트로 보여줍니다.첨부파일의 내용을 보여줍니다.</p>
                                        <div class="file-control">
                                            <strong>저작권 정보</strong>
                                            <button type="button" class="btn-icon-text__download">다운로드</button>
                                            <button type="button" class="btn-icon-text__close btn-preview-close">닫기</button>
                                        </div>
                                    </div>
                                    <p class="text-date">
                                        홍길동<b>&#124;</b>2024.12.12
                                    </p>
                                </div>
                                <div class="item">
                                    <h3>
                                        <strong><a class="color-third" href="#">&#91;문서 일반&#93; 컨텐츠 제목</a></strong>
                                        <span>자료실 &#62; 문서 일반</span>
                                    </h3>
                                    <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는3줄을 기본으로 합니다. 키워드는 볼드 처리합니다. 3줄을 넘을 때는 ... 처리합니다. 검색된 정보의 내용을 보여줍니다. 내용 줄수는3줄을 기본으로 합니다. 키워드는 볼드 처리합니다. 3...</p>
                                    <div class="file-download">
                                        <a href="#" class="pptx">첨부문서.pptx</a>
                                        <button type="button" class="btn-icon__preview">파일 찾기</button>
                                    </div>
                                    <div class="file-wrap">
                                        <p>첨부파일의 내용을 텍스트로 보여줍니다. 첨부파일의 내용을 텍스트로 보여줍니다.첨부파일의 내용을 보여줍니다.</p>
                                        <div class="file-control">
                                            <strong>저작권 정보</strong>
                                            <button type="button" class="btn-icon-text__download">다운로드</button>
                                            <button type="button" class="btn-icon-text__close btn-preview-close">닫기</button>
                                        </div>
                                    </div>
                                    <p class="text-date">
                                        홍길동<b>&#124;</b>복지부<b>&#124;</b>2024.12.12
                                    </p>
                                </div>
                            </div>
                            <div class="more-info-area">
                                <a href="#" class="btn-icon-text__more">문서관리 더보기</a>
                            </div>
                        </div>
                    </div>


                    <div class="box-area" style="display: none;">
                        <div class="box-area__tit">
                            <h2 class="box-tit">
                                포털 검색 
                                <button type="button" class="btn-info on">정보</button>
                                <div class="popup-wrap" style="display: none;">
                                    <button type="button" class="btn-icon__close2">닫기</button>
                                    <section class="txt-wrap">
                                        <p class="txt">카테고리에 대한 설명입니다. 카테고리에 대한 설명입니다.카테고리에 대한 설명입니다.</p>
                                    </section>
                                </div>
                            </h2>
                        </div>
                        <div class="box-area__content">
                            <div class="portal-result-box">
                                <div class="item">
                                    <div class="portal">
                                        <div class="portal__thumnail">

                                        </div>
                                        <div class="portal__content">
                                            <h3>
                                                <strong><a class="color-third" href="#">컨텐츠 제목</a></strong>
                                                <a href="#" class="btn-icon-text__more">관련기사 보기</a>
                                            </h3>
                                            <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는3줄을 기본으로 합니다. 키워드는 볼드 처리합니다. 3줄을 넘을 때는 ... 처리합니다. 검색된 정보의 내용을 보여...</p>    
                                        </div>
                                        
                                    </div>
                                    <p class="text-date">
                                        네이버 뉴스<b>&#124;</b>2024.12.12 12:50
                                    </p>
                                </div>
                                <div class="item">
                                    <div class="portal">
                                        <div class="portal__content">
                                            <h3>
                                                <strong><a class="color-third" href="#">컨텐츠 제목</a></strong>
                                                <a href="#" class="btn-icon-text__more">관련기사 보기</a>
                                            </h3>
                                            <p class="txt">검색된 정보의 내용을 보여줍니다. 내용 줄수는3줄을 기본으로 합니다. 키워드는 볼드 처리합니다. 3줄을 넘을 때는 ... 처리합니다. 검색된 정보의 내용을 보여...</p>    
                                        </div>
                                        
                                    </div>
                                    <p class="text-date">
                                        네이버 뉴스<b>&#124;</b>2024.12.12 12:50
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </main>

        <!-- footer -->
        <footer>
            <div class="inner">
                <div class="search-form">
                    <div class="input-control">
                        <input type="text" />
                        <button type="button" class="btn-setting">검색 세팅</button>

                        <!-- 검색 box -->
                        <div class="box-setting">
                            <div class="box-setting__buttom">
                                <div class="area">
                                    <button type="button">첫단어 보기</button>
                                    <span class="circle"></span>
                                    <button type="button">끝단어 보기</button>
                                </div>

                                <button class="close btn-autoComplete-close">닫기</button>
                            </div>
                            <ul>
                                <li>
                                    <button type="button"><b>검색</b> 설정</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>기록삭제</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b></button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>기록</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>엔진</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>광고마케터</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>기록확인</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>엔진순위</button>
                                </li>
                                <li>
                                    <button type="button"><b>검색</b>어 트렌드</button>
                                </li>
                            </ul>
                        </div>

                        <button type="button" class="btn-icon__search">검색</button>
                    </div>
                </div>
                <p class="copy">© Rayful System 2024. All rights reserved.</p>
            </div>
        </footer>
    </div>
</body>
<script defer src="../js/main.js" >
</script>
</html>