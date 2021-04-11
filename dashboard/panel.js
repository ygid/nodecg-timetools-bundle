const CounterInstances = nodecg.Replicant('CounterInstances');
const CounterObjs = {};

CounterInstances.on("change", (instances) => {
    if (instances) {
        generateCounterContainers(instances)
        displayCounterInstances(instances)
    }
})

const counterObjsWatcher = (obj) => {
    obj.on("change", (objs, index) => {
        displayCounterInstances(CounterInstances.value)
    })
}

function generateCounterContainers(instances) {
    var instance_container = document.getElementById('counter-instances')
    for(var i=0; i<instances.length; i++) {
        CounterObjs[instances[i].name] = nodecg.Replicant(instances[i].name);
        counterObjsWatcher(CounterObjs[instances[i].name])
        
        if (!document.getElementById('counter-container-'+i)) {
            var templ = document.createElement('div')
            templ.id = "counter-container-"+i.toString()
            instance_container.appendChild(templ)
        }
    }   
}

function displayCounterInstances(instances) {
    for(var i=0; i<instances.length; i++) {
        var counter_container = document.getElementById('counter-container-'+i)
        var seconds = 0
        
        var counter_obj = CounterObjs[instances[i].name];
        if (counter_obj.value) {
            seconds = counter_obj.value.elapsed
        }

        nodecg.log.debug(seconds);
        if (counter_container) {
            var clock = formatClock(seconds)
            counter_container.innerHTML = clock
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