var pre = new Vue({
    el: "#presentation",
    data: {
        title: "",
        courseId: "",
        courseName: "",
        courseScore: "",
        courseNum: "",
        is_class1: true,
        coursesData: [

        ],
        finalCourseId: [

        ],
        classData: {

        },
        courseResult1: [

        ],
        courseResult2: [

        ],
        middleCourseResult1: new Array(),
        middleCourseResult2: new Array(),
    },
    methods: {
       
        addCourse: function () {
            console.log('page1-coursedata', this.coursesData);
            this.coursesData.push({
                id: this.courseId,
                name: this.courseName,
                score: this.courseScore,
                num: this.courseNum
            });
            this.finalCourseId.push(this.courseId);
            this.courseId = "";
            this.courseName = "";
            this.courseScore = "";
            this.courseNum = "";
        },
        removeCourse: function (index) {
            //console.log(index);
            this.coursesData.splice(index, 1);
            this.finalCourseId.splice(index, 1);
        },
        saveCourse: function () {

            console.log('page1-coursedata2', JSON.stringify(this.coursesData))
            for (var i = 0; i < this.coursesData.length; i++) {
                var a = this.coursesData[i];
                var id = a.id;
                var name = a.name;
                var score = a.score;
                var num = a.num;
                var joins = name + '&' + score + '&' + num;
                console.log('page1-joins', joins);
                sessionStorage.setItem(id, joins);
                console.log(sessionStorage.getItem("dat2"));
            }
            sessionStorage.removeItem("courseids");
            var courseids = this.finalCourseId.join('-');
            console.log("page1-courseids", courseids);
            sessionStorage.setItem("courseids", courseids);
            alert("保存信息成功！");

        },
        addClass: function () {
            var login_div = document.createElement('iframe');
            var login_close = document.createElement('i');
            var blocker = document.createElement('div');
            login_div.src = "addClass.html";
            login_div.classList.add('login', 'new');
            login_close.classList.add('fa', 'fa-close', 'fa-2x', 'login_close', 'new');
            blocker.classList.add('box', 'new');
            var body = document.getElementById('container');
            body.insertBefore(login_close, body.childNodes[0]);
            body.insertBefore(login_div, body.childNodes[0]);
            body.insertBefore(blocker, body.childNodes[0]);
            $('html,body').css('overflow', 'hidden')
            $(".login_close").click(login_complete);
        },
        removeClass: function (index) {
            var classes = sessionStorage.getItem("classId").split(',');
            index++;
            for (var i = 0; i < classes.length; i++) {
                var className = "class" + index;
                console.log(className, classes[i]);
                if (classes[i] == className) {
                    classes.splice(i, 1);
                    //this.classData.splice(i, 1);
                    delete this.classData.className;
                    console.log(this.classData);
                    sessionStorage.removeItem(className);
                }
            }
            var classid = classes.join(',');
            if (classes.length == 0)
                sessionStorage.removeItem("classId");
            else
                sessionStorage.setItem("classId", classid);
            location.reload();
        },
        upload: function () {
            var form = document.querySelector("#form");
            var formlist = new FormData(form);
            if ($('#job_file').val() != '' || $('#major_file').val() != '') {
                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:5000/api/Upload",
                    data: formlist,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        var result = JSON.parse(data);

                        if (result.status == "success") {
                            var context = "上传成功！，共上传 " + result.file_nums + " 件";
                            alert(context);
                        }

                        // reset the upload boxes
                        $('#job_file').val('');
                        $('#major_file').val('');
                        $('.dropify-wrapper').removeClass('has-preview');
                        $('.dropify-render .dropify-extension').remove();
                        $('.dropify-render i').remove();
                        $('.dropify-render img').remove();
                        $('.dropify-preview').css('display','none');
                        
                    }
                });
            } else {
                alert("请至少上传一个文件！");
            }

        },

    },
    created: function () {
        var ids = sessionStorage.getItem("courseids");
        console.log("page1-ids", ids);
        if (ids != '' && ids != null) {
            ids = ids.split("-");
            for (var i = 0; i < ids.length; i++) {
                this.finalCourseId.push(ids[i]);
                var courseInfo = sessionStorage.getItem(ids[i]).split('&');
                this.coursesData.push({
                    id: ids[i],
                    name: courseInfo[0],
                    score: courseInfo[1],
                    num: courseInfo[2]
                });
            }
        }
    },
    mounted: function () {
        if (sessionStorage.getItem("classId") != '' && sessionStorage.getItem("classId") != null) {
            var classes = sessionStorage.getItem("classId").split(',');
            for (var i = 0; i < classes.length; i++) {
                var classCoursesTemp = [];
                var courseList = sessionStorage.getItem(classes[i]);
                console.log('page2-class', classes[i]);
                if (courseList != null && courseList != '') {
                    var courseLists = courseList.split('-');
                    for (var j = 0; j < courseLists.length; j++) {
                        var course = sessionStorage.getItem('courseids').split('-')[courseLists[j]];
                        var courseName = sessionStorage.getItem(course).split('&')[0];
                        classCoursesTemp.push({
                            id: course,
                            name: courseName
                        });
                    }
                }
                Vue.set(this.classData, classes[i], classCoursesTemp);
                //console.log(JSON.stringify(this.classData));

                //console.log(this.classData.getItem('class'));
                //console.log(this.classData.)
                //var classUni=this.classData.getItem
                //this.classData.classes
                //pre.classData = Object.assign({}, pre.classData, {
                //  age: 27,
                //  favoriteColor: 'Vue Green'
                // });// 方案二
            }
        }
    }

})

$(document).ready(function () {
    pre.title = "";
    for (var i = 0; i < 5; i++) {
        pre.middleCourseResult1[i] = new Array();
        pre.middleCourseResult2[i] = new Array();
        for (var j = 0; j < 7; j++) {
            pre.middleCourseResult1[i][j] = {
                id: "",
                name: "",
                score: ""
            };
            pre.middleCourseResult2[i][j] = {
                id: "",
                name: "",
                score: ""
            };
        }
    }

    $('.mynav').click(function () {
        update($(this).attr('name'));

    });
    $('.classes').click(function () {
        if ($("input[name='classes']:checked").val() == "class1") {
            pre.is_class1 = true;
        } else {
            pre.is_class1 = false;
        }


    });

})

function backToMain(){
    //if it is in homepage now
    if($("#homePage").css('display') != "none")
        return;
    update("homePage");
    if($("#title").css('display') != "none")
        $("#title").toggle(100,'swing');
}

function update(type) {
    console.log(type);
    if($("#title").css('display') == "none")
        $("#title").toggle(100,'swing');
    if (type == "results")
        pre.title = " > 排课结果";
    else if (type == "statics")
        pre.title = " > 输入课程数据";
    else if (type == "filesInfo")
        pre.title = " > 文件上传与下载";
    else if (type == "classInfo")
        pre.title = " > 添加班级信息";
    else if (type == "homePage")
        ;    
    else 
        alert("error in update!");    
    $(".pre").each(function () {
        if ($(this).attr('id') == type)
            $(this).css('display', 'inline');
        else
            $(this).css('display', 'none');
    });
}


function login_complete() {
    console.log("关闭子页面");
    $('.new').remove();
    $('html,body').css('overflow', '');
    location.reload();
    update("classInfo");
}

function toggleMain(event, type){
    var id;
    if($(event).hasClass("fa-caret-down"))
        $(event).removeClass("fa-caret-down").addClass("fa-caret-left");
    else    
        $(event).removeClass("fa-caret-left").addClass("fa-caret-down");
    if(type == "manual"){
        id = "#manual-main";
    }
    else{
        id = "#auto-main";
    }
    $(id).toggle(100,'swing');
}