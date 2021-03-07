var app = new Vue({
    el: ".nav-main",
    data: {

    },
    methods: {
        navOn: function ($event) {
            $event.currentTarget.className = "nav-item nav-on";
        },
        navOff: function ($event) {
            $event.currentTarget.className = "nav-item";
        },
        submitResult: function () {
            add_loader();
            var data = {
                items: [],
                class1: [],
                class2: [],
            };
            data.items = pre.coursesData;
            var class1 = pre.classData.class1;
            var class2 = pre.classData.class2;
            for (var i = 0; i < class1.length; i++) {
                data.class1.push(class1[i].id);
            }
            for (var i = 0; i < class2.length; i++) {
                data.class2.push(class2[i].id);
            }

            console.log(JSON.stringify(data));

            add_loader();

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
                    remove_loader();
                }

            });
        },
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
    text.innerText = '排课计算中，请稍后';
    text.classList.add('new1');
    spinner.classList.add('fa', 'fa-spinner', 'fa-5x', 'fa-spin', 'new1');
    blocker.classList.add('box', 'new1');
    var body = document.getElementById('container');
    body.insertBefore(text, body.childNodes[0]);
    body.insertBefore(spinner, body.childNodes[0]);
    body.insertBefore(blocker, body.childNodes[0]);
    $('html,body').css('overflow', 'hidden')

}

function remove_loader() {
    $('.new1').remove();
    $('html,body').css('overflow', '');
}