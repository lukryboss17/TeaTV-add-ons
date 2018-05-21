

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = {
    DOMAIN: "http://phimbathu.com",
    SEARCH: function SEARCH(title) {
        return 'http://phimbathu.com/tim-kiem.html?q=' + title;
    },
    HEADERS: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    },
    DOMAIN_THUYET_MINH: function DOMAIN_THUYET_MINH(id, vietsubId) {
        return 'http://phimbathu.com/ajax/getLinkPlayer/id/' + id + '/index/' + vietsubId;
    }
};

var Phimbathu = function () {
    function Phimbathu(props) {
        _classCallCheck(this, Phimbathu);

        this.libs = props.libs;
        this.movieInfo = props.movieInfo;
        this.settings = props.settings;

        this.state = {};
    }

    _createClass(Phimbathu, [{
        key: 'searchDetail',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _libs, httpRequest, cheerio, stringHelper, qs, _movieInfo, title, year, season, episode, type, videoUrl, detailUrl, tvshowDetailUrl, urlSearch, htmlSearch, $, itemSearch, htmlVideo, $_2, hrefVideo, htmlDetail, _$_, itemEpisode;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _libs = this.libs, httpRequest = _libs.httpRequest, cheerio = _libs.cheerio, stringHelper = _libs.stringHelper, qs = _libs.qs;
                                _movieInfo = this.movieInfo, title = _movieInfo.title, year = _movieInfo.year, season = _movieInfo.season, episode = _movieInfo.episode, type = _movieInfo.type;


                                if (season == 0 && type == 'tv') {
                                    season = title.match(/season *([0-9]+)/i);
                                    season = season != null ? +season[1] : '0';
                                    title = title.replace(/season *[0-9]+/i, '');

                                    if (season == 0) {
                                        season = title.match(/ss *([0-9]+)/i);
                                        season = season != null ? +season[1] : '0';
                                        title = title.replace(/ss *[0-9]+/i, '');
                                    }
                                }

                                videoUrl = false;
                                detailUrl = false;
                                tvshowDetailUrl = false;
                                urlSearch = URL.SEARCH(stringHelper.convertToSearchQueryString(title, '+'));
                                _context.next = 9;
                                return httpRequest.getHTML(urlSearch, URL.HEADERS);

                            case 9:
                                htmlSearch = _context.sent;
                                $ = cheerio.load(htmlSearch);
                                itemSearch = $('#page-info .item');


                                itemSearch.each(function () {

                                    var hrefMovie = URL.DOMAIN + $(this).find('a').attr('href');
                                    var titleVi = $(this).find('.name span').text();
                                    var titleMovie = $(this).find('.name-real').text();
                                    var yearMovie = titleMovie.match(/\( *([0-9]+)/i);
                                    yearMovie = yearMovie != null ? +yearMovie[1] : false;
                                    var seasonMovie = titleMovie.match(/season *([0-9]+)/i);
                                    seasonMovie = seasonMovie != null ? +seasonMovie[1] : 0;
                                    titleMovie = titleMovie.replace(/season *[0-9]+ *\(* *[0-9]+ *\)*$/i, '').trim();
                                    titleMovie = titleMovie.replace(/\( *[0-9]+ *\)/i, '').trim();
                                    var status = $(this).find('.label').text().toLowerCase();
                                    var status_lower = status.trim().replace('ậ', 'a');

                                    if (!titleMovie) {
                                        titleMovie = titleVi;
                                    }

                                    if (stringHelper.shallowCompare(title, titleMovie)) {

                                        if (type == 'movie' && status_lower.indexOf('full') == -1 && status_lower.indexOf('tap') == -1 && year == yearMovie) {
                                            videoUrl = hrefMovie;
                                            return;
                                        } else if (type == 'tv' && (status_lower.indexOf('full') != -1 || status_lower.indexOf('tap') != -1) && (season == seasonMovie || seasonMovie == 0)) {

                                            videoUrl = hrefMovie;
                                            return;
                                        }
                                    }
                                });

                                if (!(videoUrl != false)) {
                                    _context.next = 21;
                                    break;
                                }

                                _context.next = 16;
                                return httpRequest.getHTML(videoUrl, URL.HEADERS);

                            case 16:
                                htmlVideo = _context.sent;
                                $_2 = cheerio.load(htmlVideo);
                                hrefVideo = $_2('.btn-see').attr('href');


                                if (hrefVideo.indexOf('phimbathu') == -1) {
                                    hrefVideo = URL.DOMAIN + hrefVideo;
                                }

                                if (type == 'movie' && hrefVideo) {
                                    detailUrl = hrefVideo;
                                } else if (type == 'tv' && hrefVideo) {

                                    tvshowDetailUrl = hrefVideo;
                                }

                            case 21:
                                if (!(type == 'tv' && tvshowDetailUrl)) {
                                    _context.next = 28;
                                    break;
                                }

                                _context.next = 24;
                                return httpRequest.getHTML(tvshowDetailUrl);

                            case 24:
                                htmlDetail = _context.sent;
                                _$_ = cheerio.load(htmlDetail);
                                itemEpisode = _$_('#list_episodes a');


                                itemEpisode.each(function () {

                                    var hrefEpisode = _$_(this).attr('href');
                                    var numberEpisode = _$_(this).text();
                                    numberEpisode = numberEpisode.match(/([0-9]+)/i);
                                    numberEpisode = numberEpisode != null ? +numberEpisode[1] : false;

                                    if (numberEpisode && numberEpisode == episode) {
                                        detailUrl = hrefEpisode;
                                        return;
                                    }
                                });

                            case 28:

                                this.state.detailUrl = detailUrl;
                                return _context.abrupt('return');

                            case 30:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function searchDetail() {
                return _ref.apply(this, arguments);
            }

            return searchDetail;
        }()
    }, {
        key: 'getHostFromDetail',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this = this;

                var _libs2, httpRequest, cheerio, qs, gibberish, hosts, type, phimbathu, playerSetting, html_video, $, player, key, item, item1, link_direct, arrServer, idServer, itemServer, arrPromise;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _libs2 = this.libs, httpRequest = _libs2.httpRequest, cheerio = _libs2.cheerio, qs = _libs2.qs, gibberish = _libs2.gibberish;

                                if (this.state.detailUrl) {
                                    _context3.next = 3;
                                    break;
                                }

                                throw new Error("NOT_FOUND");

                            case 3:
                                hosts = [];
                                type = this.movieInfo.type;
                                phimbathu = this;
                                playerSetting = {
                                    sourceLinks: [],
                                    modelId: ''
                                };
                                _context3.next = 9;
                                return httpRequest.getHTML(this.state.detailUrl, URL.HEADERS);

                            case 9:
                                html_video = _context3.sent;
                                $ = cheerio.load(html_video);
                                player = html_video.match(/var *playerSetting *\=([^\$]+)/i);

                                player = player != null ? player[1] : '';

                                eval('playerSetting =  ' + player);

                                key = 'phimbathu.com4590481877' + playerSetting.modelId;


                                for (item in playerSetting.sourceLinks) {

                                    for (item1 in playerSetting.sourceLinks[item].links) {
                                        link_direct = gibberish.dec(playerSetting.sourceLinks[item].links[item1].file, key);


                                        if (link_direct) {

                                            hosts.push({
                                                provider: {
                                                    url: phimbathu.state.detailUrl,
                                                    name: "Server 2 - Vietsub"
                                                },
                                                result: {
                                                    file: link_direct,
                                                    label: playerSetting.sourceLinks[item].links[item1].label,
                                                    type: 'direct'
                                                }
                                            });
                                        }
                                    }
                                }

                                // thuyetminh
                                arrServer = [];
                                idServer = html_video.match(/\/ajax\/getLinkPlayer\/id\/([^\/]+)/i);

                                idServer = idServer != null ? idServer[1] : '';

                                itemServer = $('.server-item');


                                itemServer.each(function () {

                                    var nameServer = $(this).find('.name span').text();

                                    if (nameServer && nameServer.trim() == 'Thuyết Minh') {

                                        var itemNumberServer = $(this).find('.option .btn');

                                        itemNumberServer.each(function () {
                                            var numberServer = $(this).attr('data-index');
                                            arrServer.push(numberServer);
                                        });
                                    }
                                });

                                arrPromise = arrServer.map(function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(val) {
                                        var jsonThuyetMinh, _item, _item2, _link_direct;

                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return httpRequest.getHTML(URL.DOMAIN_THUYET_MINH(idServer, val));

                                                    case 2:
                                                        jsonThuyetMinh = _context2.sent;

                                                        jsonThuyetMinh = JSON.parse(jsonThuyetMinh);

                                                        for (_item in jsonThuyetMinh.sourceLinks) {

                                                            for (_item2 in jsonThuyetMinh.sourceLinks[_item].links) {
                                                                _link_direct = gibberish.dec(jsonThuyetMinh.sourceLinks[_item].links[_item2].file, key);


                                                                if (_link_direct) {

                                                                    hosts.push({
                                                                        provider: {
                                                                            url: phimbathu.state.detailUrl,
                                                                            name: "Server 2 - Thuyet Minh"
                                                                        },
                                                                        result: {
                                                                            file: _link_direct,
                                                                            label: jsonThuyetMinh.sourceLinks[_item].links[_item2].label,
                                                                            type: 'direct'
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        }

                                                    case 5:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this);
                                    }));

                                    return function (_x) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());
                                _context3.next = 24;
                                return Promise.all(arrPromise);

                            case 24:

                                this.state.hosts = hosts;
                                return _context3.abrupt('return');

                            case 26:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getHostFromDetail() {
                return _ref2.apply(this, arguments);
            }

            return getHostFromDetail;
        }()
    }]);

    return Phimbathu;
}();

thisSource.function = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(libs, movieInfo, settings) {
        var phimbathu;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        phimbathu = new Phimbathu({
                            libs: libs,
                            movieInfo: movieInfo,
                            settings: settings
                        });
                        _context4.next = 3;
                        return phimbathu.searchDetail();

                    case 3:
                        _context4.next = 5;
                        return phimbathu.getHostFromDetail();

                    case 5:
                        return _context4.abrupt('return', phimbathu.state.hosts);

                    case 6:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x2, _x3, _x4) {
        return _ref4.apply(this, arguments);
    };
}();

thisSource.testing = Phimbathu;