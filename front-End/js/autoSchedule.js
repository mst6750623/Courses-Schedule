var auto = new Vue({
    el: "#autoMode",
    data: {
        title: "",
        courseId: "",
        courseName: "",
        courseScore: "",
        courseNum: "",
        is_class1: true,
        type: "选择专业",
        coursesData: [

        ],
        finalCourseId: [

        ],
        classData: {

        },
        courseResultAll: {
           
        },
        courseResultNow: [

        ],
        types: [
            
        ],
        middleCourseResult: new Array(),

    },
    methods: {
        upload: function () {
            var form = document.querySelector("#form");
            var formlist = new FormData(form);
            if ($('#job_file').val() != '' || $('#major_file').val() != '') {
                $.ajax({
                    type: "POST",
                    url: "/api/Upload",
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
                        $('.dropify-preview').css('display', 'none');

                    }
                });
            } else {
                alert("请至少上传一个文件！");
            }

        },
        chooseMajor: function (event) {

            var type = event.currentTarget.innerText;
            console.log(auto.types);
            auto.type = type;
            var nowArr = auto.courseResultAll[type];
            auto.courseResultNow = nowArr;
        }
    },
    mounted: function () {

        if (sessionStorage.getItem("major-types") != null) {
            this.types = JSON.parse(sessionStorage.getItem("major-types"));
            for (var i = 0; i< this.types.length;i++) {
                var type = this.types[i];
                if (sessionStorage.getItem(type)) {
                    var temp_course = JSON.parse(sessionStorage.getItem(type));
                    Vue.set(this.courseResultAll, type, temp_course);
                } else {
                    Vue.set(this.courseResultAll, type, "");
                }

            }
        }

    }
})