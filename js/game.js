$(function () {
  // START
  function showHideButtons(isMobile) {
    if (!isMobile) {

      $('#show_share_btns').on('click', showShareButtons);
      $('#hide_share_btns').on('click', hideShareButtons);
      $('#show_subscription_btns').on('click', showSubscrButtons);
      $('#hide_subscription_btns').on('click', hideSubscrButtons);

      $('#show_share_btns').off('click', showMobileShareButtons);

    } else {

      $('#show_share_btns').off('click', showShareButtons);
      $('#hide_share_btns').off('click', hideShareButtons);
      $('#show_subscription_btns').off('click', showSubscrButtons);
      $('#hide_subscription_btns').off('click', hideSubscrButtons);

      $('#show_share_btns').on('click', showMobileShareButtons);

      $('#show_subscription_btns').on('click', function () {
        $('.subscription-btns-block').css('display', 'flex');
        $('#show_subscription_btns').hide();

        return false;
      })

      $('#hide_subscription_btns').on('click', function () {
        $('.subscription-btns-block').hide();
        $('#show_subscription_btns').css('display', 'flex');
      })
    }
  }

  function showShareButtons() {
    $('.share-btns-block').css('display', 'flex');
    $('.subscribe-btns-block').hide();
  }

  function hideShareButtons() {
    $('.share-btns-block').hide();
    $('.subscribe-btns-block').css('display', 'flex');
  }

  function showSubscrButtons() {
    $('.subscription-btns-block').css('display', 'flex');
    $('.subscribe-btns-block').hide();

    return false;
  }

  function hideSubscrButtons() {
    $('.subscription-btns-block').hide();
    $('.subscribe-btns-block').css('display', 'flex');
  }

  function showMobileShareButtons() {
    $('.btn-share').toggleClass('btn-share--active');
    $('.share-btns-block').toggleClass('share-btns-block--active');
  }

  function hideMobileShareButtons(event) {
    const target = event.target;
    const isButton = target.closest('.btn-share');
    const isShareBlock = target.closest('.share-btns-block');

    if (!isButton && !isShareBlock) {
      $('.btn-share').removeClass('btn-share--active');
      $('.share-btns-block').removeClass('share-btns-block--active');
    }
  }

  function initMobileSlider(isMobile) {
    if (!isMobile) return;
    $('.game-images').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      dotsClass: 'game-images__dots',
      initialSlide: 1,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 768,
          settings: 'unslick',
        }
      ]
    })
  }


  $('.open-search-btn').on('click', showSearchForm);

  $(document).on('click', function (event) {
    hideMobileShareButtons(event);
    hideSearchForm(event);
  });

  function showSearchForm() {
    $('.search-block').addClass('search-block--active');
  }

  function hideSearchForm(event) {
    const isSearchBlock = event.target.closest('.search-block');
    const isOpenButton = event.target.closest('.open-search-btn');

    if (!isSearchBlock && !isOpenButton) {
      $('.search-block').removeClass('search-block--active');
    }
  }

  $('.game-images').on('click', hideItemsOnSlider);

  function hideItemsOnSlider(event) {

    if ($('.search-block').hasClass('search-block--active')) {
      $('.search-block').removeClass('search-block--active');
      return;
    }

    if ($('.btn-share').hasClass('btn-share--active')) {
      $('.btn-share').removeClass('btn-share--active');
      $('.share-btns-block').removeClass('share-btns-block--active');
      return;
    }

    if (!event.target.closest('.game-images__dots')) {

      $('.game-page header').toggleClass('hide-top');
      $('.btn-save-game').toggleClass('hide-right');
      $('.game-page .btn-share').toggleClass('hide-left');
      $('.share-btns-block').toggleClass('hide-left');
      $('.game-images__dots').toggleClass('game-images__dots--hide');
      $('.game .game-info-main').toggleClass('game-info--move');

      $('.game-images__item').toggleClass('game-images__item--bigger');
    }
  }

  $('.game-info__details').on('click', function () {
    $(this).toggleClass('game-info__details--show-text');
  });


  if (document.location.hash.includes('prices_chart')) {
    $('#prices_chart').slideDown(1);
    $('.price-chart-btn-wrap').addClass('price-chart-btn-wrap--open');

    $(window).on('load', scrollToPriceChart);

  } else {
    $('#prices_chart').slideUp(1);
    $('.price-chart-btn-wrap').removeClass('price-chart-btn-wrap--open');
  }

  function scrollToPriceChart() {
    $("#prices_chart")[0].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  $('.price-chart-btn-wrap').on('click', showHidePriceChart);

  function showHidePriceChart(event) {
    event.preventDefault();

    $('#prices_chart').slideToggle();
    $('.price-chart-btn-wrap').toggleClass('price-chart-btn-wrap--open');

    addChartHash();
  }

  function addChartHash() {
    if (document.location.hash.includes('prices_chart')) {
      history.pushState(null, null, window.location.pathname);
    } else {
      history.pushState(null, null, '#prices_chart');
    }
  }

  $('.description-top-btns > .btn-price-chart').on('click', function(event) {
    event.preventDefault();

    $('#prices_chart').slideDown();
    $('.price-chart-btn-wrap').addClass('price-chart-btn-wrap--open');

    if (!(document.location.hash.includes('prices_chart'))) {
      history.pushState(null, null, '#prices_chart');
    }
    
    scrollToPriceChart();
  })

  // END



  var $countdown = $('#countdown');
  if ($countdown.length) {
    $countdown.countdown($countdown.data('release_date'))
      .on('update.countdown', function (event) {
        var format = '%H:%M:%S';
        if (event.offset.totalDays > 0) {
          format = '%-D<span>д.</span>' + format;
        }
        $(this).html(event.strftime(format));
      })
      .on('finish.countdown', function (event) {
        $(this).html('Игра доступна для покупки!').parent().addClass('disabled');
      });
  }

  var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;
  var dateFormat = d3.time.format("%d.%m.%Y");

  var red = "#da2304";

  if (lineData.length) {
    lineData.forEach(function (d) {
      d.date = parseDate(d.date);
    });
    function sortByDate(a, b) {
      return a.date - b.date;
    }

    lineData = lineData.sort(sortByDate);

    var dataNest = d3.nest()
      .key(function (d) {
        return d.platform;
      })
      .entries(lineData);


    var platfromData;

    function addPercentageDate(s, e, percentage) {
      var diff = 0;
      var d1 = new Date(s.getFullYear(), s.getMonth(), (s.getDate() - diff));
      var d2 = new Date(e.getFullYear(), e.getMonth(), (e.getDate() + diff));

      var t1 = d1.getTime();
      var t2 = d2.getTime();

      diff = (t2 - t1) * 1000; // seconds
      if (diff > 30 * 24 * 3600) {
        d1.setDate(1);
        d2.setDate(1);
        d2.setMonth(d2.getMonth() + 1);
      }


      return [d1, d2];
    }

    function addPercentageNumber(s, e, percentage) {
      var diff = Math.ceil((e - s) * percentage / 100);
      if (diff < 8) {
        diff = 8;
      }
      var min = s - diff;
      var max = e + diff;

      return [min, max];
    }


    var width = $('#prices_chart').width() - 20,
      height = $('#prices_chart').height() - 20,
      margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 56
      };
    var svg = d3.select("#prices_chart"),
      x = d3.time.scale().range([margin.left, width - margin.right]),
      y = d3.scale.linear().range([height - margin.top, margin.bottom]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(-height + margin.bottom + margin.top)
      .tickSubdivide(true)
      .ticks(width < 600 ? 4 : 5)
      .tickFormat(d3.time.format("%m.%Y"));

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-width + margin.left + margin.right)
      .orient("left");

    var lineFunc = d3.svg.line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.price);
      })
      .interpolate('linear');

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
      .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
      .attr("id", function (d) {
        return d;
      })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", -1)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");
    //shadow
    var defs = svg.append("defs");
    var filter = defs.append("filter")
      .attr("id", "dropshadow");
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 2)
      .attr("result", "offsetBlur");
    filter.append("feFlood")
      .attr("in", "offsetBlur")
      .attr("flood-color", "#3d3d3d")
      .attr("flood-opacity", "0.5")
      .attr("result", "offsetColor");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");


    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .append("text")
      .attr("class", "x_axis_label")
      .attr("dy", "1.1em")
      .attr("dx", "700")
      .attr("fill", red)
      .text("t")
      ;

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (margin.left) + ",0)")
      .append("text")
      .attr("class", "y_axis_label")
      .attr("dy", "1.2em")
      .attr("dx", "-30")
      .attr("fill", red)
      .html("&#8381;")
      ;

    svg.append("path")
      //                    .attr("filter", "url(#dropshadow)")
      .attr("class", "line")
      .style("stroke", red)
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      ;

    svg.append("line")
      .style("stroke", "black")
      .attr("x1", margin.left)
      .attr("y1", height - margin.top + 1)
      .attr("x2", margin.left)
      .attr("y2", margin.bottom)
      .attr("stroke-width", 1)
      .attr("shape-rendering", "crispEdges")
      .attr("marker-end", "url(#licensing)")
      ;

    svg.append("line")
      .style("stroke", "black")
      .attr("x1", margin.left)
      .attr("y1", height - margin.top)
      .attr("x2", width)
      .attr("y2", height - margin.top)
      .attr("stroke-width", 1)
      .attr("shape-rendering", "crispEdges")
      .attr("marker-end", "url(#licensing)")
      ;

    showChart($('.platform-buy').first().data('platform'));

    var focus = svg.append("g")
      .style("display", "none");
    // append the x line
    focus.append("line")
      .attr("class", "x")
      .style("stroke", red)
      .style("stroke-dasharray", "2")
      .style("opacity", 0.5)
      .attr("y1", 0)
      .attr("y2", height);

    // append the y line
    focus.append("line")
      .attr("class", "y")
      .style("stroke", red)
      .style("stroke-dasharray", "2")
      .style("opacity", 0.5)
      .attr("x1", width)
      .attr("x2", width);

    // place the date at the intersection
    focus.append("text")
      .attr("class", "y3")
      .style("stroke", "white")
      .style("stroke-width", "3.5px")
      .style("opacity", 0.8)
      .attr("dx", 8)
      .attr("dy", "1em");
    focus.append("text")
      .attr("fill", red)
      .attr("class", "y4")
      .attr("dx", 8)
      .attr("dy", "1em");

    // place the value at the intersection
    focus.append("text")
      .attr("class", "y1")
      .style("stroke", "white")
      .style("stroke-width", "3.5px")
      .style("opacity", 0.8)
      .attr("dx", -18)
      .attr("dy", "+1.3em");
    focus.append("text")
      .attr("class", "y2")
      .attr("dx", -18)
      .attr("dy", "+1.3em");
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function () {
        focus.style("display", null);
      })
      .on("mouseout", function () {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);
    var bisectDate = d3.bisector(function (d) {
      return d.date;
    }).left;
  }

  function showChart(platform) {
    dataNest.forEach(function (data) {
      if (data.key === platform) {
        platfromData = data.values;

        var duration = 750;

        var minX = d3.min(platfromData, function (d) {
          return d.date;
        }),
          maxX = d3.max(platfromData, function (d) {
            return d.date;
          }),

          minY = d3.min(platfromData, function (d) {
            return d.price;
          }),
          maxY = d3.max(platfromData, function (d) {
            return d.price;
          });

        x.domain(addPercentageDate(minX, maxX, 10));
        y.domain(addPercentageNumber(minY, maxY, 10));
        var svg2 = d3.select("#prices_chart").transition();
        svg2.select(".line")
          .duration(duration)
          .attr("d", lineFunc(platfromData));
        svg2.select(".x.axis")
          .duration(duration)
          .call(xAxis);
        svg2.select(".y.axis")
          .duration(duration)
          .call(yAxis);

        var label_array = [];
        var anchor_array = [];
        var circle_array = [];

        var indexMin, indexMax;
        platfromData.forEach(function (d, index) {
          if (d.price === minY) {
            indexMin = index;
          }
          if (d.price === maxY) {
            indexMax = index;
          }
        });

        var charWidth = 8;

        platfromData.forEach(function (d, index) {
          if (index === 0 || index === indexMin || index === indexMax || index === platfromData.length - 1) {
            circle_array.push({
              x: x(d.date),
              y: y(d.price)
            });
          }

          if (index === indexMin || index === indexMax) {
            var label_array_length = label_array.push({
              x: x(d.date),
              y: y(d.price),
              name: d.price,
              price: d.price,
              width: (d.price.toString()).length * charWidth,
              height: 12
            });
            anchor_array.push({ x: x(d.date), y: y(d.price), r: 3 });
            if (index === indexMin) {
              indexMin = label_array_length - 1;
            }
            if (index === indexMax) {
              indexMax = label_array_length - 1;
            }
          }
        });

        if (typeof indexMin !== 'undefined') {
          label_array[indexMin].name = '<tspan fill="' + red + '">min</tspan> ' + label_array[indexMin].name;
          label_array[indexMin].width += 4 * charWidth;
        }
        if (typeof indexMax !== 'undefined') {
          label_array[indexMax].name = '<tspan fill="' + red + '">max</tspan> ' + label_array[indexMax].name;
          label_array[indexMax].width += 4 * charWidth;
        }

        var circle = svg.selectAll("circle")
          .data(circle_array);
        circle.transition()
          .duration(duration)
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
        circle.enter()
          .append("circle")
          .attr("class", "circle")
          .attr("stroke", red)
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .attr("fill", "white")
          .attr("r", 6)
          .attr("stroke-opacity", 1)
          .attr("fill-opacity", 1)
          .attr("stroke-width", 1)
          .attr("r", 3.4);

        circle.exit().remove();

        d3.labeler()
          .label(label_array)
          .anchor(anchor_array)
          .width(width)
          .height(height)
          .start(100);


        var labels = svg.selectAll(".label")
          .data(label_array);
        labels.transition()
          .duration(duration)
          .tween("text", function (d) {
            var i = d3.interpolate(this.textContent.match(/\d+\.?\d*/)[0], d.price),
              prec = (d.name + "").split("."),
              round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            return function (t) {
              var newValue = Math.round(i(t) * round) / round;
              this.innerHTML = typeof d.name === 'string' ? d.name.replace(d.price, newValue) : newValue;
            };
          })
          .attr("x", function (d) {
            return Math.min(d.x, width - d.width);
          })
          .attr("y", function (d) {
            return (d.y);
          });
        labels
          .enter()
          .append("text")
          .attr("class", "label")
          .attr('text-anchor', 'start')
          .html(function (d) {
            return '<tspan>' + d.name + '</tspan>';
          })
          .attr("x", function (d) {
            return Math.min(d.x, width - d.width);
          })
          .attr("y", function (d) {
            return (d.y);
          })
          .attr("fill", "black");

        labels.exit().remove();
      }
    });
  }

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(platfromData, x0, 1),
      d0 = platfromData[i - 1],
      d1 = platfromData[i];
    var d = (typeof d1 != 'undefined') && (x0 - d0.date > d1.date - x0) ? d1 : d0;

    focus.select("text.y1")
      .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
      .text(d.price + ' ' + d.store);

    focus.select("text.y2")
      .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
      .text(d.price + ' ' + d.store);

    focus.select("text.y4")
      .attr("transform", "translate(" + (x(d.date) - 40) + "," + (height - 5) + ")")
      .text(dateFormat(d.date));

    focus.select(".x")
      .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
      .attr("y2", height - y(d.price));

    focus.select(".y")
      .attr("transform", "translate(" + (width - margin.left) * -1 + "," + y(d.price) + ")")
      .attr("x2", width + width - margin.left);
  }

  function getCookie(a) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  var $paymentSystemIcons = $('#payment_systems_block .payment-system-icon');
  var $paymentSystemBlock = $('#payment_systems_block');
  var $paymentSystemBtn = $('.payment-system-btn');

  function togglePaymentSystems() {
    $paymentSystemBtn.parent().toggleClass('open');
    if ($paymentSystemBlock.hasClass('new')) $('#prices_block').removeClass('new_payment_systems');

    // adjust left for payment system block dependent on number of icons
    if ($paymentSystemBlock.length && !$paymentSystemBlock.hasClass('new')) {
      var iconNumber = $paymentSystemIcons.length;
      var iconSize = $paymentSystemIcons.first().outerWidth(true);
      var leftPadding = parseInt($paymentSystemBlock.css('padding-left'));
      var left = $paymentSystemBtn.parent().position().left - iconNumber / 2 * iconSize + leftPadding;
      var minLeft = $(window).width() * 0.02; // min left is 2vw
      if (left < minLeft) {
        left = minLeft;
      }
      $paymentSystemBlock.css('left', left);
    }

    $paymentSystemBlock.toggle();
  }

  $paymentSystemBtn.on('click', togglePaymentSystems);

  $('body').on('click', function (e) {
    var $target = $(e.target);
    if (!$target.is($paymentSystemBtn) && $paymentSystemBlock.is(':visible')
      && !$paymentSystemBlock.hasClass('new') && !$paymentSystemBlock.has($target).length
    ) {
      togglePaymentSystems();
    }
  });

  $paymentSystemIcons.on('click', function () {
    $(this).toggleClass('active');
    applyActivePaymentSystems();
  });

  $('#payment_system_apply').on('click', function () {
    $paymentSystemBlock.removeClass('new');
    $('#prices_block').removeClass('new_payment_systems');
    applyActivePaymentSystems();
    togglePaymentSystems();

    return false;
  });

  var paymentSystems = getCookie('payment_systems');
  if (document.cookie.indexOf('payment_systems') === -1) (async () => {
    $paymentSystemBlock.addClass('new');
    $('.payment-system-default').addClass('active');
    fetch('https://api.hot-game.info/get_local.php')
      .then(e => e.json())
      .then(r => {
        if (r.response != 'ru' && r.response != 'by') {
          document.querySelector('[data-payment_system="visa_mastercard_ru"]').classList.remove('active');
          document.querySelector('[data-payment_system="visa_mastercard"]').classList.add('active');
        }
        if (r.response == 'ua') {
          document.querySelector('[data-payment_system="money_yandex"]').classList.remove('active');
          document.querySelector('[data-payment_system="qiwi"]').classList.remove('active');
        }
      })
      .catch(e => console.log('Region not loaded', e));
    //applyActivePaymentSystems();
    togglePaymentSystems();
    $('#prices_block').addClass('new_payment_systems');
  })();
  else if (paymentSystems) {
    paymentSystems = paymentSystems.split(',');
  }

  if (paymentSystems.length) {
    $paymentSystemIcons.each(function () {
      if (paymentSystems.includes($(this).data('payment_system'))) {
        $(this).addClass('active');
      }
    });

    applyPaymentSystems(paymentSystems);
  }

  function getActivePaymentSystems() {
    var paymentSystems = [];
    $paymentSystemIcons.filter('.active').each(function () {
      paymentSystems.push($(this).data('payment_system'));
    });

    return paymentSystems;
  }

  function applyActivePaymentSystems() {
    var paymentSystems = getActivePaymentSystems();
    setCookie('payment_systems', paymentSystems.join(','), 365);
    applyPaymentSystems(paymentSystems);
  }

  function applyPaymentSystems(paymentSystems) {
    $paymentSystemBtn.toggleClass('active', !!paymentSystems.length);

    var notMatchClass = 'payment-system-not-match';

    // for old prices
    $('.price-block .price-value').each(function () {
      var minPaymentSystem = null;
      var values = $(this).data('payment_system_values');

      if (Array.isArray(values)) {
        values.some(function (paymentSystem) {
          if (paymentSystems.includes(paymentSystem.slug)) {
            minPaymentSystem = paymentSystem;
            return true;
          }
        });
      }

      var activePlatform = $('.platform-buy.active').first().data('platform');
      var $paymentSystemIcon = $(this).prev();
      var $priceBlock = $(this).parents('.price-block');
      if (minPaymentSystem) {
        var iconAttr = {
          'class': 'payment-system-icon payment-system-icon-' + minPaymentSystem.slug,
          'title': minPaymentSystem.title
        };
        if ($paymentSystemIcon.length) {
          $paymentSystemIcon.attr(iconAttr);
        } else {
          $('<span></span>').attr(iconAttr).insertBefore($(this));
        }
        $priceBlock.removeClass(notMatchClass);
        $(this).text(minPaymentSystem.price);

        for (var platform in minPaymentSystem.priceDiff) {
          var $priceDiff = $priceBlock.find('.price-diff.' + platform);
          if (!$priceDiff.length) {
            $('<div><div></div></div>')
              .addClass('price-diff')
              .addClass(platform)
              .data('platform', platform)
              .insertBefore($priceBlock.find('.game-price'));
          }
        }
        $priceBlock.find('.price-diff').each(function () {
          var $priceDiff = $(this);
          var platform = $priceDiff.data('platform');
          if (platform in minPaymentSystem.priceDiff) {
            var priceDiffValue = '-' + minPaymentSystem.priceDiff[platform] + '%';
            $priceDiff.find('div').text(priceDiffValue);
            $priceDiff.toggleClass('big-diff', minPaymentSystem.priceDiff[platform] >= 15);
            $priceDiff.toggle(platform === activePlatform);
          } else {
            $priceDiff.hide();
          }
        });
      } else {
        if (paymentSystems.length) {
          $priceBlock.addClass(notMatchClass);
        } else {
          $priceBlock.removeClass(notMatchClass);
        }

        $paymentSystemIcon.remove();
        $(this).text($(this).data('final_price'));

        $priceBlock.find('.price-diff').each(function () {
          var $priceDiff = $(this);
          var platform = $priceDiff.data('platform');
          if ($priceDiff.data('price_diff')) {
            var priceDiffValue = '-' + $priceDiff.data('price_diff') + '%';
            $priceDiff.find('div').text(priceDiffValue);
            $priceDiff.toggleClass('big-diff', $priceDiff.data('price_diff') >= 15);
            $priceDiff.toggle(platform === activePlatform);
          } else {
            $priceDiff.hide();
          }
        });
      }
    });

    // for new prices
    $('.price-list-item .price-payment-system').each(function () {
      var minPaymentSystem = null;
      var minPaymentSystems = [];
      var $paymentSystemsContainer = $(this);
      var $priceValue = $paymentSystemsContainer.siblings('.price-value');
      var values = $priceValue.data('payment_system_values');

      if (Array.isArray(values)) {
        values.some(function (paymentSystem) {
          if (paymentSystems.includes(paymentSystem.slug)) {
            minPaymentSystem = paymentSystem;
            return true;
          }
        });
        values.some(function (paymentSystem) {
          if (
            paymentSystems.includes(paymentSystem.slug)
            && minPaymentSystem.percent === paymentSystem.percent
            && minPaymentSystems.length < 4
          ) {
            minPaymentSystems.push(paymentSystem);
          }
        });
      }

      var activePlatform = $('.platform-buy.active').first().data('platform');
      var $priceBlock = $paymentSystemsContainer.parents('.price-list-item');
      if (minPaymentSystem) {
        $paymentSystemsContainer.html('');
        $('<span></span>').html(
          '<span class="red">+' + minPaymentSystem.percent + '%</span> (' + minPaymentSystem.amount
          + '&#8381;) <span class="payment-system-text">комиссии при оплате</span>:'
        ).addClass('gray').appendTo($paymentSystemsContainer);

        minPaymentSystems.forEach(function callbackFn(element) {
          var iconAttr = {
            'class': 'payment-system-icon payment-system-icon-' + element.slug,
            'title': element.title
          };
          $('<span></span>').attr(iconAttr).appendTo($paymentSystemsContainer);
        });
        $paymentSystemsContainer.show();

        $priceBlock.removeClass(notMatchClass);
        $priceValue.text(minPaymentSystem.price);

        for (var platform in minPaymentSystem.priceDiff) {
          var $priceDiff = $priceBlock.find('.price-diff.' + platform);
          if (!$priceDiff.length) {
            $('<div><div></div></div>')
              .addClass('price-diff')
              .addClass(platform)
              .data('platform', platform)
              .insertBefore($priceBlock.find('.game-price'));
          }
        }
        $priceBlock.find('.price-diff').each(function () {
          var $priceDiff = $(this);
          var platform = $priceDiff.data('platform');
          if (platform in minPaymentSystem.priceDiff) {
            var priceDiffValue = '-' + minPaymentSystem.priceDiff[platform] + '%';
            $priceDiff.find('div').text(priceDiffValue);
            $priceDiff.toggleClass('big-diff', minPaymentSystem.priceDiff[platform] >= 15);
            $priceDiff.toggle(platform === activePlatform);
          } else {
            $priceDiff.hide();
          }
        });
      } else {
        if (paymentSystems.length) {
          $priceBlock.addClass(notMatchClass);
        } else {
          $priceBlock.removeClass(notMatchClass);
        }

        // reset payment system icon
        $paymentSystemsContainer.html('');
        $paymentSystemsContainer.hide();
        $priceValue.text($priceValue.data('final_price'));

        $priceBlock.find('.price-diff').each(function () {
          var $priceDiff = $(this);
          var platform = $priceDiff.data('platform');
          if ($priceDiff.data('price_diff')) {
            var priceDiffValue = '-' + $priceDiff.data('price_diff') + '%';
            $priceDiff.find('div').text(priceDiffValue);
            $priceDiff.toggleClass('big-diff', $priceDiff.data('price_diff') >= 15);
            $priceDiff.toggle(platform === activePlatform);
          } else {
            $priceDiff.hide();
          }
        });
      }
    });

    $('.game-prices-list .price-list-item').sort(function (a, b) {
      var $priceValueA = $(a).find('.price-value');
      var $priceValueB = $(b).find('.price-value');

      // нет в наличии в конец
      if (!$priceValueA.length && !$priceValueB.length) {
        return 0;
      }
      if (!$priceValueA.length) {
        return 1;
      }
      if (!$priceValueB.length) {
        return -1;
      }

      // если есть цены с выбраными системами оплаты то их в начало
      var aM = $(a).hasClass(notMatchClass);
      var bM = $(b).hasClass(notMatchClass);
      if (aM !== bM) {
        return aM ? 1 : -1;
      }

      // сортировка по цене
      var priceA = parseInt($priceValueA.text());
      var priceB = parseInt($priceValueB.text());
      if (priceA !== priceB) {
        return priceA > priceB ? 1 : -1
      }

      // по позиции магазина
      return $priceValueA.data('position') > $priceValueB.data('position') ? 1 : -1
    }).appendTo('.game-prices-list');
  }

  function toggleShowHidePrices() {
    $('#prices-spoiler').toggleClass('active');
    if ($('.game-prices-list').css('max-height') !== 'none') {
      $('.game-prices-list').css('max-height', '').css('overflow', '');
    } else {
      let maxHeight = 0;
      $('.price-list-item').each(function (index) {
        if (index < 5) {
          maxHeight += $(this).outerHeight();
        }
      })
      $('.game-prices-list').css('max-height', maxHeight).css('overflow', 'hidden');
    }
  }

  function togglePricesSpoiler() {
    if ($('.price-list-item').filter(':visible').length > 5) {
      $('#prices-spoiler').show();
    } else {
      $('#prices-spoiler').hide();
    }
  }

  if ($('#prices-spoiler').length) {
    $('#prices-spoiler').on('click', toggleShowHidePrices);
    togglePricesSpoiler();
    toggleShowHidePrices();
  }


  $('.platform-buy').on('click', function () {
    var platform = $(this).data('platform');

    $('.platform-buy').removeClass('active');
    $('.platform-buy[data-platform="' + platform + '"]').addClass('active');

    if (lineData.length) {
      showChart(platform);
    }

    applyFilters();

    return false;
  });

  $('.price-type-buy').on('click', function () {
    var priceType = $(this).data('price_type');

    if ($(this).siblings('.price-type-buy.active').length >= 1 || !$(this).hasClass('active')) {
      $('.price-type-buy[data-price_type="' + priceType + '"]').toggleClass('active');
    }

    applyFilters();

    return false;
  });

  function applyFilters() {
    var $priceBlock = $('.game-prices-list .price-list-item:not(.show-subscribe-banner)').hide();
    $priceBlock.find('.price-diff').hide();

    var platform = $('.platform-buy.active').first().data('platform');

    var priceTypes = [];
    $('.price-type-buy.active').each(function (index) {
      var priceType = $(this).data('price_type');
      if (priceTypes.indexOf(priceType) === -1) {
        priceTypes.push(priceType);
      }
    });

    $.each(priceTypes, function (index, priceType) {
      $priceBlock.filter('.' + platform + '.' + priceType).show().find('.price-diff.' + platform).show();
    });

    togglePricesSpoiler();
  }


  function showSubscribePopup() {
    $('body').append('<div class="modal-overlay"></div>');
    $('.modal-overlay').fadeTo(500, 0.7);
    $('#subscribe_block').fadeIn();
  }
  function hideSubscribePopup() {
    $("#subscribe_block, .modal-overlay").fadeOut(500, function () {
      $(".modal-overlay").remove();
    });
  }

  $('.show-subscribe-btn').on('click', function (e) {
    e.preventDefault();
    showSubscribePopup();
  });
  $('#subscribe_banner').on('click', function (e) {
    e.preventDefault();
    showSubscribePopup();
  });

  if (window.location.hash == '#subscribe') {
    showSubscribePopup();
  }

  $(document).on('click', '.modal-overlay, #subscribe_block .modal-close', hideSubscribePopup);

  $('#subscribe_block form').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);

    $('.subscribe-platforms .subscription-platform.active').each(function () {
      var platform = $(this).data('platform');
      $.post($form.attr('action'),
        $form.serialize() + '&platform=' + platform,
        function (data) {
          if ('errors' in data) {
            $('#subscribe_errors').text(data['errors']).show();
          } else {
            hideSubscribePopup();
          }
        }
      );
    });

    return false;
  });

  $('.subscribe-platforms .subscription-platform').on('click', function () {
    $(this).toggleClass('active');

    return false;
  });


  var saveGameAjax = false;
  $('#save_game, #subscribe_user').on('click', function (e) {
    if (!saveGameAjax) {
      saveGameAjax = true;
      var $this = $(this);
      var data = {
        'game': $this.data('game'),
        'remove': +$this.hasClass('active') // int
      };

      $this.toggleClass('active');
      var newTitle = $this.data('title');
      var oldTitle = $this.attr('title');
      $this.data('title', oldTitle);
      $this.attr('title', newTitle);

      $.post($this.data('action'), data, function (data) {
        saveGameAjax = false;
      });
    }

    e.preventDefault();
    return false;
  });
  $('.subscribe-user').on('click', function (e) {
    e.preventDefault();
    if (!saveGameAjax) {
      saveGameAjax = true;
      var $this = $(this);
      var data = {
        'game': $this.data('game'),
        'platform': $this.data('platform'),
        'remove': +$this.hasClass('active') // int
      };

      $this.toggleClass('active');
      $('#show_subscription_btns').toggleClass('active', !!$('.subscribe-user.active').length);

      $.post($this.data('action'), data, function (data) {
        saveGameAjax = false;
      });
    }

    return false;
  });
  $('#subscribed_no_price').on('click', function (e) {
    if (!saveGameAjax) {
      saveGameAjax = true;
      var $this = $(this);
      var platforms = $this.data('platforms').split(',');
      var remove = +$this.hasClass('subscribed-no-price'); // int
      platforms.forEach(function (platform) {
        var data = {
          'game': $this.data('game'),
          'platform': platform,
          'remove': remove
        };
        $.post($this.data('action'), data, function (data) {
          saveGameAjax = false;
        });
      });

      $this.toggleClass('subscribed-no-price');
      $this.toggleClass('show-subscribe-no-price');
      $this.find('.btn-subs').toggleClass('active');
      $this.find('.btn-subs').toggleClass('white');
      $this.find('.text').toggleClass('hidden');

    }

    e.preventDefault();
    return false;
  });

  $('#subscribed_no_discount').on('click', function (e) {
    if (!saveGameAjax) {
      saveGameAjax = true;
      var $this = $(this);
      var data = {
        'game': $this.data('game'),
        'platform': $('.platform-buy.active').first().data('platform'),
        'remove': +$this.hasClass('subscribed') // int
      };

      $this.toggleClass('subscribed');

      $.post($this.data('action'), data, function (data) {
        saveGameAjax = false;
      });
    }

    e.preventDefault();
    return false;
  });

  var gameRatingVote = false;
  $(document).on('click', '.not-voted > .game-rating-vote', function (e) {
    if (!gameRatingVote) {
      gameRatingVote = true;
      var $this = $(this);
      var data = {
        'game': $this.parent().data('game'),
        'value': $this.data('value') // int
      };

      $this.addClass('active');
      $this.parent().removeClass('not-voted');

      $('#game_rating_note').hide();

      $.post($this.parent().data('action'), data, function (data) {
        gameRatingVote = false;
        if ('value' in data) {
          $('#game_rating_value').text(data['value'])
        }
      });
    }

    e.preventDefault();
    return false;
  });

  $(document).on('click', '.comment-reply-btn:not(.active)', function (e) {
    $('.comment-reply-btn.active').removeClass('active');
    $(this).addClass('active');
    var parentId = $(this).data('id');
    $('#create_comment_parent').val(parentId);
    var name = $(this).parents('.comment').find('.comment-author-username').text();
    $('#create_comment_reply_username').text(name).parent().show();

    $('html, body').animate({
      scrollTop: $('#comments').offset().top
    }, 400);
    $('#create_comment_body').focus();

    e.preventDefault();
    return false;
  });

  function cancelReply() {
    $('.comment-reply-btn.active').removeClass('active');
    $('#create_comment_parent').val('');
    $('#create_comment_reply_username').text('').parent().hide();
  };

  $(document).on('click', '#create_comment_reply_close, .comment-reply-btn.active', function (e) {
    cancelReply();
    e.preventDefault();
    return false;
  });

  $(document).on('submit', '#create_comment_form', function (e) {
    var $form = $(this);

    $.post($form.attr('action'), $form.serialize(), function (data) {
      var parent = $('#create_comment_parent').val();
      if (parent) {
        $('#c' + parent).after(data);
      } else {
        $('.comment-form-block').after(data);
      }
      $form[0].reset();
      cancelReply();
    });

    e.preventDefault();
    return false;
  });

  $(document).on('click', '.comment-vote-btn', function (e) {
    var $this = $(this);

    $.post($('#comments').data('vote-action'), {
      'vote': $this.data('vote'),
      'comment': $this.data('comment')
    }, function (data) {
      $this.siblings('.comment-rating').text(data.rating);
      $this.siblings('.comment-vote-btn').removeClass('active');
      if (data.vote_result) {
        $this.addClass('active');
      } else {
        $this.removeClass('active');
      }
    });

    e.preventDefault();
    return false;
  });

  $('.sys-rec-tab').on('click', function () {
    var target = $(this).data('target');
    $('.sys-rec-tab').removeClass('active');
    $('.sys-rec-tab[data-target="' + target + '"]').addClass('active');

    $('.sys-rec-tab-content').hide();
    $(target).show();

    swiperInit();
  });

  $('.info-wide-close').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.parents('.info-wide-block').hide();

    $.ajax({
      url: $this.data('url'),
      data: { key: $this.data('key') },
      type: 'POST'
    });

    var date = new Date();
    date.setTime(+ date + (365 * 86400000));
    document.cookie = $this.data('key') + "=1" + date.toGMTString() + "; path=/";

    return false;
  });

  function toggleDescriptionImages(isMobile) {
    var $images = $('.game .description img');
    if (isMobile) {
      $images.unwrap('a');
    } else {
      $images.each(function () {
        if (!$(this).parent('a').length) {
          $(this).wrap('<a rel="nofollow" data-lightbox="game_image" href="' + $(this).attr('src') + '"></a>');
        }
      });
    }
  }

  function toggleGameSlides(isMobile) {
    var $sliderWrapper = $('#game_slider_wrapper');

    if (isMobile) {
      $sliderWrapper.remove();
    } else {
      if (!$sliderWrapper.length) {
        var $sliderWrapperTemplate = $('#game_slider_template');
        $sliderWrapperTemplate.after($sliderWrapperTemplate.html());

        $('#accordion2').accordionSlider({
          // width: 719,
          height: 187,
          responsiveMode: 'custom',
          openPanelOn: 'hover',
          mouseDelay: 50,
          mouseWheel: false,
          startPanel: 0,
          keyboard: false
        });
      }
    }
  }

  function resize() {
    var isMobile = $(window).width() <= 768;

    toggleDescriptionImages(isMobile);
    toggleGameSlides(isMobile);

    initMobileSlider(isMobile);
    showHideButtons(isMobile);
  }

  $(window).on('resize', resize);
  resize();

  $('.youtube-player').each(function () {
    $(this).one('click', youtubeIframe).html(youtubeThumb($(this).data('id')));
  });

  function youtubeThumb(id) {
    var thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg">',
      play = '<div class="play"></div>';
    return thumb.replace("ID", id) + play;
  }

  function youtubeIframe() {
    var embed = 'https://www.youtube.com/embed/ID?autoplay=1&enablejsapi=1';
    var $iframe = $('<iframe>', {
      'src': embed.replace('ID', $(this).data('id')),
      'frameborder': 0,
      'allowfullscreen': 1,
      'allow': 'autoplay; fullscreen',
    });
    $iframe.on('load', function () {
      $(this).get(0).contentWindow.postMessage(JSON.stringify({
        "event": "command",
        "func": 'playVideo'
      }), "*");
    });
    $(this).html($iframe);
  }



  var leftSideTabsContent = new Swipe(document.getElementById('left_side_tabs_content'), {
    startSlide: 0,
    draggable: true,
    autoRestart: false,
    disableScroll: false,
    stopPropagation: true,
    callback: function (index, element) {
      leftSideTabChange($('.left-side-mobile-tabs li[data-index="' + index + '"]'));
      var rec = element.getBoundingClientRect();
      $(element).parent().animate({ height: rec.height }, 100);
    }
  });

  $('.left-side-mobile-tabs li').on('click', function () {
    leftSideTabChange($(this));

    leftSideTabsContent.slide($(this).data('index'));
  });

  function swiperInit() {
    leftSideTabChange($('.left-side-mobile-tabs li.active'));
    var index = $('.left-side-mobile-tabs li.active').data('index');

    setTimeout(function () {

      var $element = $('.left-side-tabs-content-wrap > div:nth-child(' + (index + 1) + ')');
      var rec = $element.get(0).getBoundingClientRect();
      $element.parent().animate({ height: rec.height }, 100);
    }, 10)
  }

  swiperInit();

  function leftSideTabChange($this) {
    $this.siblings().removeClass('active');
    $this.addClass('active');

    if ($this.attr('id') === 'mobile_slider_tab') {
      $('#mobile_slides').find('img').each(function () {
        if ($(this).attr('data-src')) {
          $(this).attr('src', $(this).attr('data-src'));
          $(this).removeAttr('data-src');
          // initMobileSlider(true);
        }
      });
    }

    var $list = $this.parent();

    var itemRec = $this.get(0).getBoundingClientRect();
    var listRec = $list.get(0).getBoundingClientRect();

    var newX = listRec.width / 2 - itemRec.width / 2 - (itemRec.left - listRec.left);

    $list.css('transform', 'translateX(' + newX + 'px)');
  }

  $(document).on('click', '.price-list-item a', function () {
    $(this).parents('.price-block').addClass('clicked');
  });

});


  // function initMobileSlider(isMobile) {
  //     if (!isMobile) {
  //         return;
  //     }
  //     var slideCount = $('#mobile_slides ul li').length;
  //     var slideWidth = $('#mobile_slides').parents('.hg-block').width();
  //     var slideHeight = Math.round(slideWidth * 56.23 / 100); // slides have know sides ratio
  //     var sliderUlWidth = slideCount * slideWidth;

  //     $('#mobile_slides').css({ width: slideWidth, height: slideHeight });
  //     $('#mobile_slides li').css({ width: slideWidth, height: slideHeight });

  //     $('#mobile_slides ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

  //     $('#mobile_slides ul li:last-child').prependTo('#mobile_slides ul');
  // }

  // function mobileSlideLeft() {
  //     $('#mobile_slides ul').animate({
  //         left: + $('#mobile_slides ul li').width()
  //     }, 200, function () {
  //         $('#mobile_slides ul li:last-child').prependTo('#mobile_slides ul');
  //         $('#mobile_slides ul').css('left', '');
  //     });
  // };

  // function mobileSlideRight() {
  //     $('#mobile_slides ul').animate({
  //         left: - $('#mobile_slides ul li').width()
  //     }, 200, function () {
  //         $('#mobile_slides ul li:first-child').appendTo('#mobile_slides ul');
  //         $('#mobile_slides ul').css('left', '');
  //     });
  // };

  // $('.mobile-slide-controls .control-left').on('click', mobileSlideLeft);
  // $('.mobile-slide-controls .control-right').on('click', mobileSlideRight);