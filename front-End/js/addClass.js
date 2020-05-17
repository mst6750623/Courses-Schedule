var app=new Vue({
    el:"#forms",
    data:{
        courses:[
           
        ],
        courseids:[

        ],
        finalCourse:[

        ],
        classId:[

        ]
    },
    methods:{
        confirm:function(){
            var a=this.finalCourse;
           
            var courseInfo=a.join('-');
            if(sessionStorage.getItem('classId') == null || sessionStorage.getItem("classId") == '')
            {
                var index="class1";
                console.log("page2-index1",index);
                this.$data.classId.push(index);
                sessionStorage.setItem("classId",this.classId);
                sessionStorage.setItem(index,courseInfo);
            }
            else 
            {
                var classId=sessionStorage.getItem("classId").split(',');
                for(var i=0;i<classId.length;i++)
                {
                    this.classId.push(classId[i]);
                }
                var num=parseInt(classId[classId.length-1].slice(5))+1;
                if(num > 2)
                {
                    alert("暂时只支持两个班级的排课哦！");
                    return ;
                }
                console.log("page2-num",num);
                var index="class"+num;
                console.log("page2-index2",index);
                this.classId.push(index);
                sessionStorage.setItem("classId",this.classId);
                sessionStorage.setItem(index,courseInfo);
            }
            //window.parent.reload();
	        parent.login_complete() ;
        }

    },
    mounted:function(){
        
        var ids= sessionStorage.getItem("courseids");
        if(ids != '' && ids != null)
            {
                ids=ids.split("-");
                for(var i=0;i<ids.length;i++)
                {
                    this.courseids.push(ids[i]);
                    var courseInfo=sessionStorage.getItem(ids[i]).split('&');
                    this.courses.push({id:ids[i],name:courseInfo[0]})
                }
            }
        //this.$data.courseids.set(sessionStorage.getItem("courseids").split("-"));
        console.log('page2-courseids',JSON.stringify(this.courseids));    
    }

})

$(document).ready(function(){
    
})