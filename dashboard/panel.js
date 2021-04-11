const CounterInstances = nodecg.Replicant('CounterInstances');

CounterInstances.on("change", (instances) => {
    if (instances) {
        generateCounterContainers(instances)
        displayCounterInstances(instances)
    }
})

function generateCounterContainers(instances) {
    var instance_container = document.getElementById('counter-instances')
    for(var i=0; i<instances.length; i++) {
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
        var seconds = instances[i].elapsed
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
      hour = "0"+hour;
    if(minute < 10)
      minute = "0"+minute;
    if(seconds < 10)
      seconds = "0"+seconds;
    return hour + ":" + minute + ":" + seconds;
 }