(function () {

    var aboutModule = angular.module('aboutModule', []);

    /**
     * Directive which controls the About modal view.
     */
    aboutModule.directive('about', ['ToastService', function (ToastService) {
        return {
            restrict: 'E',
            templateUrl: './view/about.html',
            link: function (scope, element, attrs) {
                scope.devs1 = [];
                scope.devs2 = [];

                var pitonImg = "/img/icons/ms-icon-150x150.png";

                /**
                 * Mock, while we haven't the data from server.
                 */
                var devsMock = [
                    {
                        img: "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/14238081_1113263298761799_1919877617174904524_n.jpg?oh=f158b025fc6b539e6809c4b9b459dbbf&oe=59120F4D",
                        name: "Eric Breno",
                        act: "Front-end developer",
                        links: [
                            {
                                link: 'https://github.com/ericbreno',
                                name: 'GitHub'
                            },
                            {
                                link: 'https://facebook.com/ebreno02',
                                name: 'Facebook'
                            },
                            {
                                link: 'https://br.linkedin.com/in/eric-breno-a5aab612b',
                                name: 'LinkedIn'
                            }
                        ]
                    },
                    {
                        img: "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/12227607_916959888381245_1242392325075309635_n.jpg?oh=29c64d897644f81be052776ace670d28&oe=59195DE5",
                        name: "Estacio Neto",
                        act: "Designer, Front-end, Back-end developer",
                        links: [
                            {
                                link: 'https://github.com/estacioneto',
                                name: 'GitHub'
                            },
                            {
                                link: 'https://www.facebook.com/estacio.pereira',
                                name: 'Facebook'
                            },
                            {
                                link: 'https://br.linkedin.com/in/estácio-pereira-33264b130',
                                name: 'LinkedIn'
                            }
                        ]
                    },
                    {
                        img: "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/16195400_1308636269204011_8079265809658101142_n.jpg?oh=395a4f8dc4e00202d036e198896effd0&oe=591CCE5D",
                        name: "Lucas Diniz",
                        act: "Front-end developer",
                        links: [
                            {
                                link: 'https://github.com/lucasdiniz',
                                name: 'GitHub'
                            },
                            {
                                link: 'https://www.facebook.com/lucazdinis',
                                name: 'Facebook'
                            }
                        ]
                    },
                    {
                        img: "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/15871663_1256751847713324_8814299098471740889_n.jpg?oh=e7b3274d2ef619579e38426836ec1e5f&oe=591CFD53",
                        name: "Luciano Junior",
                        act: "Designer, Front-end developer",
                        links: [
                            {
                                link: 'https://github.com/luciannojunior',
                                name: 'GitHub'
                            },
                            {
                                link: 'https://www.facebook.com/luciannojunior',
                                name: 'Facebook'
                            },
                            {
                                link: 'https://twitter.com/luciannojunior',
                                name: 'Twitter'
                            }
                        ]
                    },
                    {
                        img: "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/1531815_769485323080087_817876459_n.jpg?oh=7e973c3f65f22c25a3c89e5f9c403436&oe=590E9081",
                        name: "Velmer Oliveira",
                        act: "Team Management",
                        links: [
                            {
                                link: 'https://github.com/Velmer',
                                name: 'GitHub'
                            },
                            {
                                link: 'https://www.facebook.com/velmer.oliveira',
                                name: 'Facebook'
                            }
                        ]
                    },
                    {
                        img: "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/13925367_1856377561256824_4235602222870147596_n.jpg?oh=60dfeb4e3405fa37ae7bf9462cad20e2&oe=5906B09D",
                        name: "Leo Vital",
                        act: "Team Management",
                        links: [
                            {
                                link: 'https://github.com/Leulz',
                                name: 'GitHub'
                            },
                            {
                                link: 'https://www.facebook.com/leo.vital.980',
                                name: 'Facebook'
                            }
                        ]
                    }
                ];


                var timesClicked = 1;
                var lastFirstLetter = "";

                /**
                 * Triggers the name related easter egg.
                 * @param name Name clicked.
                 */
                scope.eeTrigger = function (name) {
                    var firstLetter = name.substring(0, 1);
                    var shouldTrigger = false;
                    if (firstLetter === lastFirstLetter) {
                        timesClicked++;
                    } else {
                        shouldTrigger = timesClicked === 19;
                        lastFirstLetter = firstLetter;
                        timesClicked = 1;
                    }
                    if (shouldTrigger) {
                        ToastService.showActionToast('Chega, vai procurar em outro canto agora.');
                    }
                };

                /**
                 * Main function. Shuffles devs list.
                 */
                (function () {
                    var r = devsMock;
                    r = _.shuffle(r);
                    for (var i = 0; i < 6; i++) {
                        if (i > 2) {
                            scope.devs1.push(r[i]);
                        } else {
                            scope.devs2.push(r[i]);
                        }
                    }
                } ());
            }
        };
    }]);
} ());