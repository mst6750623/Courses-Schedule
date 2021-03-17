var app = new Vue({
    el: ".nav-main",
    data: {},
    methods: {
        navOn: function ($event) {
            $event.currentTarget.className = "nav-item nav-on";
        },
        navOff: function ($event) {
            $event.currentTarget.className = "nav-item";
        },
        manualToggle: function () {
            $("#manual-schedule").toggle(200, "swing");
        },
        autoToggle: function () {
            $("#auto-schedule").toggle(200, "swing");
        },
        submitManualResult: function () {
            add_loader();
            var data = {
                items: [],
                class1: [],
                class2: [],
            };
            data.items = pre.coursesData;
            if (pre.classData.class1) {
                var class1 = pre.classData.class1;
                for (var i = 0; i < class1.length; i++) {
                    data.class1.push(class1[i].id);
                }
            }
            if (pre.classData.class2) {
                var class2 = pre.classData.class2;
                for (var i = 0; i < class2.length; i++) {
                    data.class2.push(class2[i].id);
                }
            }

            console.log(JSON.stringify(data));

            $.ajax({
                type: 'POST',
                url: '/todo/api/v1.0/tasks',
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    // Vue.set(pre.courseResult,data);
                    pre.courseResult1 = data.class1;
                    pre.courseResult2 = data.class2;
                    console.log('data', data);
                    console.log('result', pre.courseResult1, 'result2', pre.courseResult2);
                    resultTOMiddle();
                    //console.log(pre.coursesData);
                    remove_loader();
                },
                error: function () {
                    alert("手动排课出错，请重试");
                    remove_loader();
                }

            });
        },
        submitAutoResult: function () {
            /*add_loader();
            $.ajax({
                type: 'POST',
                url: '/todo/api/v1.0/tasks',
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    // Vue.set(pre.courseResult,data);
                    pre.courseResult1 = data.class1;
                    pre.courseResult2 = data.class2;
                    console.log('data', data);
                    console.log('result', pre.courseResult1, 'result2', pre.courseResult2);
                    resultTOMiddle();
                    //console.log(pre.coursesData);
                    remove_loader();
                },
                error: function () {
                    alert("自动排课出错，请重试");
                    remove_loader();
                }

            });*/
            var XMLtxt = '<?xml version="1.0" encoding="utf-8"?><root><session course="12208401" day="2" period="0" periodWithin="12"/><session course="12208401" day="3" period="4" periodWithin="22"/><session course="12210201" day="0" period="3" periodWithin="3"/><session course="12210201" day="4" period="0" periodWithin="24"/><session course="12214901" day="1" period="0" periodWithin="6"/><session course="12214901" day="4" period="3" periodWithin="27"/><session course="12215001" day="1" period="0" periodWithin="6"/><session course="12215001" day="4" period="4" periodWithin="28"/><session course="12222301" day="0" period="0" periodWithin="0"/><session course="12222301" day="3" period="3" periodWithin="21"/><session course="12228001" day="0" period="0" periodWithin="0"/><session course="12228001" day="2" period="1" periodWithin="13"/><session course="12228201" day="1" period="1" periodWithin="7"/><session course="12228201" day="3" period="5" periodWithin="23"/><session course="12228401" day="1" period="1" periodWithin="7"/><session course="12228401" day="3" period="5" periodWithin="23"/><session course="12228501" day="0" period="1" periodWithin="1"/><session course="12228501" day="2" period="5" periodWithin="17"/><session course="12228502" day="1" period="1" periodWithin="7"/><session course="12228502" day="3" period="1" periodWithin="19"/><session course="12228601" day="0" period="5" periodWithin="5"/><session course="12228601" day="4" period="2" periodWithin="26"/><session course="12229801" day="2" period="3" periodWithin="15"/><session course="12230301" day="2" period="5" periodWithin="17"/><session course="12230301" day="4" period="5" periodWithin="29"/></root>'
            var param = $(XMLtxt).find('session');
            /*var middleCourseResult = new Array();
            for (var i = 0; i < 5; i++) {
                middleCourseResult[i] = new Array();
            }*/
            
            for (var i = 0; i < param.length; i++) {
                var row = parseInt($(param[i]).attr('period'));
                var col = parseInt($(param[i]).attr('day'));
                auto.middleCourseResult[row][col] = parseInt($(param[i]).attr('course'));
            }
            Vue.set(auto.courseResultAll, "type1", auto.middleCourseResult);
            auto.types.push("type1");
            var nowArr = auto.courseResultAll[auto.types[3]];
            auto.courseResultNow = nowArr;
            //Vue.set(auto.courseResultNow, nowArr);
            console.log(auto.courseResultNow);
        }
    }
})

function resultTOMiddle() {
    //console.log("yes");
    for (var i = 0; i < pre.courseResult1.length; i++) {
        var row = i % 5;
        var col = parseInt(i / 5);
        pre.middleCourseResult1[row][col] = pre.courseResult1[i];
    }
    for (var i = 0; i < pre.courseResult2.length; i++) {
        var row = i % 5;
        var col = parseInt(i / 5);
        pre.middleCourseResult2[row][col] = pre.courseResult2[i];
    }
}


function add_loader() {
    var text = document.createElement('span');
    var spinner = document.createElement('i');
    var blocker = document.createElement('div');
    text.innerText = '排课计算中 ';
    text.classList.add('new1');
    spinner.classList.add('fa', 'fa-spinner', 'fa-spin');
    blocker.classList.add('box', 'new1');
    var body = document.getElementById('container');
    body.insertBefore(text, body.childNodes[0]);
    text.appendChild(spinner);
    //body.insertBefore(spinner, body.childNodes[0]);
    body.insertBefore(blocker, body.childNodes[0]);
    $('html,body').css('overflow', 'hidden')

}

function remove_loader() {
    $('.new1').remove();
    $('html,body').css('overflow', '');
}