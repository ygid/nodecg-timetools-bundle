const DateDiffInstances = nodecg.Replicant('DateDiffInstances');
const DateDiffObjs = [];

DateDiffInstances.on("change", (instances) => {
    if (instances) {
        generateDateDiffContainers(instances)
        NodeCG.waitForReplicants(DateDiffObjs).then(() => {
            displayDateDiffInstances(DateDiffInstances.value)
        })
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
    instance_container.innerHTML = '';
    for(var i=0; i<instances.length; i++) {
        nodecg.log.debug(instances);
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
            var dom_obj5 = template.querySelector('button[name=delete]')
            dom_obj5.addEventListener("click", deleteDateDiff.bind(null, i))

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
    
    var newEndDate = document.querySelector('#datediff-container-'+i+ ' input[name="end-date"]').value;
    if (newEndDate != '') {
        newEndDate = new Date(newEndDate);
    } else {
        newEndDate = new Date();
    }
    
    DateDiffObjs[`datediff-${i}`].value.end_datetime = (newEndDate)
}

const addDateDiff = function() {
    let instances = DateDiffInstances.value
    let br = false;
    let min = 0;
    while (br == false) {
        let exists = false;
        if (!instances) {
            br =true;
        }
        
        for (let i = 0; i < instances.length; i++) {
            if (instances[i].name) {
                if (parseInt(instances[i].name.split('-')[1]) == min) {
                    exists = true;
                }
            }
        }

        if (!exists) {
            br = true;
        }

        if (br) {
            // nodecg.log.debug(min)
            // nodecg.sendMessage('new-datediff', min);
            $.ajax({
				type: "post",
				url: "/timetools/new-datediff",
                data: {min:min}
			})
            break;
        }
        min++
    }
}
document.querySelector('#add-datediff').addEventListener('click', addDateDiff)

const deleteDateDiff = function (i) {
    let instances = DateDiffInstances.value
    for (let j = 0; j < DateDiffInstances.value.length; j++) {
        if (DateDiffInstances.value && DateDiffInstances.value[j]) {
            if (DateDiffInstances.value[j].name == 'datediff-'+i) {
                instances.splice(j, 1);
                $.ajax({
                    type: "post",
                    url: "/timetools/delete-datediff",
                    data: j
                })
            }
        }
    }
    nodecg.Replicant([`datediff-${i}`]).value = null;
}