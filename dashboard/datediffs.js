const DateDiffInstances = nodecg.Replicant('DateDiffInstances');
const DateDiffObjs = [];

DateDiffInstances.on("change", (instances) => {
    if (instances) {
        generateDateDiffContainers(instances)
        displayDateDiffInstances(instances)
        // NodeCG.waitForReplicants(DateDiffObjs).then(() => {
        //     displayDateDiffInstances(DateDiffInstances.value)
        // })
    }
})

const dateDiffObjsWatcher = (obj) => {
    obj.on("change", (objs, index) => {
        NodeCG.waitForReplicants(obj).then(() => {
            displayDateDiffInstances(DateDiffInstances.value)
        })
    })
}

function generateDateDiffContainers(instances) {
    var instance_container = document.getElementById('datediff-instances')
    for(var i=0; i<instances.length; i++) {
        DateDiffObjs[instances[i].name] = nodecg.Replicant(instances[i].name);
        dateDiffObjsWatcher(DateDiffObjs[instances[i].name])
        if (!document.getElementById('datediff-container-'+i)) {
            const template = document.getElementById("datediff-template").content.cloneNode(true);
            var dom_obj = template.querySelectorAll('div')[0]
            dom_obj.id = "datediff-container-"+i.toString()
            var dom_obj2 = template.querySelectorAll('div div')[0]
            dom_obj2.innerHTML = "DateDiff " + i
            var dom_obj4 = template.querySelector('button[name=reset]')
            dom_obj4.addEventListener("click", resetDateDiff.bind(null, i))
            instance_container.appendChild(template)
        }
    }   
}

function displayDateDiffInstances(instances) {
    for(var i=0; i<instances.length; i++) {
        var datediff_container = document.querySelector('#datediff-container-'+i+ ' [name=datediff]')
        var seconds = 0
        
        var datediff_obj = DateDiffObjs[instances[i].name];
        
        if (datediff_obj.value) {
            seconds = datediff_obj.value.elapsed;
        }

        if (datediff_container) {
            var clock = formatClock(seconds)
            datediff_container.innerHTML = `${clock}`
        }
    }
}

function formatClock(totalSeconds) {
    var hour = Math.floor(totalSeconds /3600);
    var minute = Math.floor((totalSeconds - hour*3600)/60);
    var seconds = totalSeconds - (hour*3600 + minute*60);
    if(hour < 10)
      hour = "00"+hour;
    if(minute < 10)
      minute = "0"+minute;
    if(seconds < 10)
      seconds = "0"+seconds;
    return hour + ":" + minute + ":" + seconds;
}


const resetDateDiff = function (i) {
    // var newStartDate = document.querySelector('#datediff-container-'+i+ ' input[name=start-date]').value
    // if (newStartDate != '') {
    //     newStartDate = new Date(newStartDate);
    // } else {
    //     newStartDate = new Date();
    // }
    
    var newEndDate = document.querySelector('#datediff-container-'+i+ ' input[name="end-date"]').value;
    if (newEndDate != '') {
        newEndDate = new Date(newEndDate);
    } else {
        newEndDate = new Date();
    }
    
    // DateDiffObjs[`datediff-${i}`].value.start_datetime = (newStartDate)
    DateDiffObjs[`datediff-${i}`].value.end_datetime = (newEndDate)
}