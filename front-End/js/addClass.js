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
            var a=this.$data.finalCourse;
           
            var courseInfo=a.join('-');
            if(sessionStorage.getItem('classId') == null)
            {
                var index="class1";
                console.log("index1",index);
                this.$data.classId.push(index);
                sessionStorage.setItem("classId",this.$data.classId);
                sessionStorage.setItem(index,courseInfo);
            }
            else 
            {
                var classId=sessionStorage.getItem("classId").split(',');
                for(var i=0;i<classId.length;i++)
                {
                    this.$data.classId.push(classId[i]);
                }
                var num=parseInt(classId[classId.length-1].slice(5))+1;
                console.log("num",num);
                var index="class"+num;
                console.log("index2",index);
                this.$data.classId.push(index);
                sessionStorage.setItem("classId",this.$data.classId);
                sessionStorage.setItem(index,courseInfo);
            }
            //window.parent.reload();
        }

    },
    mounted:function(){
        
        var ids= sessionStorage.getItem("courseids");
        if(ids != null)
            ids=ids.split("-");
        for(var i=0;i<ids.length;i++)
        {
            this.$data.courseids.push(ids[i]);
            var courseInfo=sessionStorage.getItem(ids[i]).split('&');
            this.$data.courses.push({id:ids[i],name:courseInfo[0]})
        }
        //this.$data.courseids.set(sessionStorage.getItem("courseids").split("-"));
        console.log(JSON.stringify(this.$data.courseids));    
    }

})

$(document).ready(function(){
    
})