# HOT GAME MOBILE REDESIGN
## Изменения в файлах
### game-page.html
- 31 - 34 - подключение slick.css, fancybox.css
- 621 - добавил на бади класс game-page чтобы стилизовать только страницу с игрой
- 766 - добавил кнопку поиска open-search-btn
- 1215 - закомментировал странный блок, который делал отступ
- 1226 - дубляж кавера для десктопа
- 1231 - 1336 - слайдер
- 1337 - добавил класс game-info-main, потому что класс game-info дублируется и его неудобно стилизовать
- 1340 - 1342 - завернул платформы в класс game-platforms-desktop чтобы спрятать их на мобильном экране
- 1344 - 1354 - блок с платформами
- 1355 - 1592 - перенес сюда short-game-description-mobile 
- 1409 - у metascore value убрал br
- 1857 - новый id = small_description
- 2105 - 2126 - новый блок subscription-block
- 2626 - 2796 - блок price-chart-wrapper
- 4842 - 4845 - подключение slick.min.js, fancybox.umd.js
- для текстов в одну строку ввел класс game-info__details
- добавил класс game-page__header-logo
- ввел классы desktop-only, mobile-only чтобы контролировать что отображается на телефоне, а что на десктопе
***
### index.html
- добавил класс game-info__genre-row
***
### styles.css
- 133 - 138 - новые стили 
- 2244 - align-items: center для .game .game-price-header-filters
- 2508 - у sys-rec-body td был vertical-align: middle, переопределил на top;
- 2679 - изменил селектор для кнопки плей (теперь там меньше вложенностей). Стало .hg-block .play
- 4456 - изменял стили для subscribe-block
- 4538 - убрал высоту у subscribe-block
- 5344 - 5382 - стили для графика цен
- 5444 - стили для .game-page .container 
- 5460 - 5468 - .game-page header.container
- 5753 - удалил стили для game-preview
- 5766 - изменял стили для .game .left-side .poster
- 5813 - изменил селектор (был селектор прямого потомка ">", я сделал селектор для всех потомков. То есть просто убрал ">")
- 5813 - изменил марджины у  .left-side-mobile-tabs li
- 5813 - 5835 - изменял стили у этих блоков
- 5911 - добавил transform-style для .game .right-side
- 5947 - закомментировал ненужные стили
- 5986 - 6713 - новые и измененные стили для мобильных экранов (768px)
- 6717 - 6738, 6794 - 6810 - стили для экранов до 480px
- 7075 - у mobile-navigation-containerswrapper был z-index: 1, сделал 5
***
### game.js
- 796 - плавный скролл к ценам 
- 1183 - 1184 - две новые функции добавил в resize()
- 1223 - 1493 - новый код
- 1225 - 1296 - переписал код для show_share_btns, hide_share_btns, show_subscription_btns, hide_subscription_btns. Перенес код в функции, чтобы удобно отключать его на мобильных или десктопах
***
### новые файлы
- ./svg/icon/new-menu-icon.svg
- ./css/slick.css
- ./css/fancybox.css
- ./js/fancybox.umd.js
- ./js/slick.min.js
***
### всего потрачено времени
22 часа