
// 웹 width (반응형) 감지
const resize = () => {
    const _resize = () => {
        const width = window.innerWidth;
        const totalWrapBtn = document.querySelector('.total-wrap__btn');
        const popularWrapBtn = document.querySelector('.popular-wrap__btn');
        const tsdMoreBtn = document.querySelector('.tsd-more-btn');
        const popularListContent = document.querySelector('.popular-list__content');

        if (width >= 1280) {
            totalWrapBtn.classList.add('on');
            popularWrapBtn.classList.add('on');
            tsdMoreBtn.classList.add('on');
            popularListContent.style.transform = `translateX(0px)`;
        } else if (width >= 768) {
            totalWrapBtn.classList.remove('on')
            popularWrapBtn.classList.remove('on')
            tsdMoreBtn.classList.remove('on');
            popularListContent.style.transform = `translateX(0px)`;
        } else if (width >= 360) {
        } else {
        }
    }

    window.addEventListener('resize', _resize);
    _resize();
}  

const commonSearchTab = () => {

    const tab = document.querySelector('.search-terms__tab');
    const tabItem = tab.querySelectorAll('li');

    const totalWrapBtn = document.querySelector('.total-wrap__btn');
    const popularWrapBtn = document.querySelector('.popular-wrap__btn');
    const buttons = [popularWrapBtn, totalWrapBtn];

    buttons.forEach((item, index) => {
        if (item) {
            item.addEventListener('click', (e) => {
                if (item.classList.contains('on')) {
                    item.classList.toggle("on");
                } else {
                    buttons.forEach((item) => {
                        item.classList.remove('on');
                    });

                    item.classList.toggle("on");
                }
            })
        }
    })
}

const buttonsEvent = () => {
    const btnSetting = document.querySelectorAll('.btn-setting');
    const btnDetailSearch = document.querySelector('.btn-detail-search');
    const btnRelated = document.querySelector('.btn-related');
    const tsdMoreBtn = document.querySelectorAll('.tsd-more-btn');
    const btnMoreLinkNext = document.querySelector('.btn-more-link.next');
    const btnMoreLinkPrev = document.querySelector('.btn-more-link.prev');
    const popularListContent = document.querySelector('.popular-list__content');
    const enterdirectlyBtnPC = document.querySelector('.enterdirectly-btn__pc');

    const selectBoxAreaBtn = document.querySelector('.select-box-area__btn');

    if (btnSetting.length > 0) {
        btnSetting.forEach((input)=> {
            input.addEventListener('click', () => {
                if (input.classList.contains('on')) {
                    input.classList.remove('on');
                } else {
                    input.classList.add('on');
                }
            })
        })
    }

    if (btnDetailSearch) {
        btnDetailSearch.addEventListener('click', () => {
            if (btnDetailSearch.classList.contains('on')) {
                btnDetailSearch.classList.remove('on');
            } else {
                btnDetailSearch.classList.add('on');
            }
        })
    }

    if (btnRelated) {
        btnRelated.addEventListener('click', () => {
            if (btnRelated.classList.contains('on')) {
                btnRelated.classList.remove('on');
            } else {
                btnRelated.classList.add('on');
            }
        })
    }

    if (tsdMoreBtn.length > 0) {
        tsdMoreBtn.forEach((input)=> {
            input.addEventListener('click', () => {
                if (input.classList.contains('on')) {
                    input.classList.remove('on');
                } else {
                    input.classList.add('on');
                }
            })
        })
    }

    if (btnMoreLinkPrev) {
        const link = btnMoreLinkPrev.querySelector('a');
        if (link) {
            link.addEventListener('click', () => {
                link.parentElement.classList.remove('on');
                btnMoreLinkNext.classList.add('on');
                popularListContent.style.transform = `translateX(0px)`
            });
        }
    }
    
    if (btnMoreLinkNext) {
        const link = btnMoreLinkNext.querySelector('a');
        if (link) {
            link.addEventListener('click', () => {
                link.parentElement.classList.remove('on');
                btnMoreLinkPrev.classList.add('on');
                popularListContent.style.transform = `translateX(-${window.innerWidth}px)`
            });
        }
    }

    if (enterdirectlyBtnPC) {
        
        const enterdirectlyBtnPC = document.querySelector('.enterdirectly-btn__pc');
        const popup = document.querySelector('.popup-wrap__pc');
        const totalWrap = document.querySelector('.total-wrap');
        const btnClose = popup.querySelectorAll(".btn-close")
        
        function showPopup(event) {
            const rect = event.target.getBoundingClientRect();
            const popupWidth = popup.offsetWidth;
            const popupHeight = popup.offsetHeight;

            let top = rect.top + window.scrollY + rect.height;
            let left = rect.left + window.scrollX;

            // Adjust position if popup overflows the window
            if (left + popupWidth > window.innerWidth) {
                left = window.innerWidth - popupWidth - 10;
            }

            if (top + popupHeight > window.innerHeight) {
                top = rect.top + window.scrollY - popupHeight - 10;
            }

            popup.style.top = `${top + 5}px`;
            popup.style.left = `${left}px`;
            popup.style.display = 'block';
        }

        function hidePopup() {
            popup.style.display = 'none';
        }
     
        enterdirectlyBtnPC.addEventListener('click', showPopup);
        btnClose.forEach(item => {
            item.addEventListener('click', hidePopup);
        })

        document.addEventListener('click', function(event) {
            if (!popup.contains(event.target) && !event.target.matches('.enterdirectly-btn__pc')) {
                hidePopup();
            }
        });

        window.addEventListener('scroll', hidePopup);
        totalWrap.addEventListener('scroll', hidePopup);
    }

    if (selectBoxAreaBtn) {
        const selectBoxAreaContent = document.querySelector('.select-box-area__content')
        const seletedList = []
        selectBoxAreaBtn.addEventListener('click', () => {
            if (selectBoxAreaBtn.classList.contains('on')) {
                selectBoxAreaBtn.classList.remove('on');
            } else {
                selectBoxAreaBtn.classList.add('on');
            }
        });
    }
}

const rageInputEvent = () => {
    const rageInputs = document.querySelectorAll('.rangeInput');

    // 선택된 요소들에 이벤트 리스너 추가
    rageInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const gradient_value = 100 / event.target.attributes.max.value;
            event.target.style.background = 'linear-gradient(to right, #008CF1 0%, #008CF1 '+gradient_value * event.target.value +'%, #fff ' +gradient_value *  event.target.value + '%, #fff 100%)';
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    var toggler = document.getElementsByClassName("caret");
    for (var i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
});

window.onload=function(){
    rageInputEvent();
    resize();
    buttonsEvent();
    commonSearchTab();
}