const CounterInstances = nodecg.Replicant('CounterInstances');
const CounterObjs = [];

CounterInstances.on("change", (instances) => {
    if (instances) {
        generateCounterContainers(instances)
        NodeCG.waitForReplicants(CounterObjs).then(() => {
            displayCounterInstances(instances)
        })
        
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
            const template = document.getElementById("counter-template").content.cloneNode(true);
            var dom_obj = template.querySelectorAll('div')[0]
            dom_obj.id = "counter-container-"+i.toString()
            var dom_obj2 = template.querySelectorAll('div div')[0]
            dom_obj2.innerHTML = "Counter " + i
            var dom_obj3 = template.querySelector('button[name=pause]')
            // we bind i value to that function so it doesnt change every loop
            dom_obj3.addEventListener("click", pauseCounter.bind(null, i))
            var dom_obj4 = template.querySelector('button[name=reset]')
            dom_obj4.addEventListener("click", resetCounter.bind(null, i))
            instance_container.appendChild(template)
        }
    }   
}

function displayCounterInstances(instances) {
    for(var i=0; i<instances.length; i++) {
        var counter_container = document.querySelector('#counter-container-'+i+ ' [name=counter]')
        var seconds = 0
        
        var counter_obj = CounterObjs[instances[i].name];
        if (counter_obj.value) {
            seconds = counter_obj.value.elapsed
        }

        // nodecg.log.debug(seconds);
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

const pauseCounter = function (counter) {
    if (CounterObjs[`counter-${counter}`].value.paused) {
        CounterObjs[`counter-${counter}`].value.paused = false
    } else {
        CounterObjs[`counter-${counter}`].value.paused = true
    }
}

const resetCounter = function (counter) {
    var newValue = document.querySelector('#counter-container-'+counter+ ' [name=value]').value
    if (newValue != '') CounterObjs[`counter-${counter}`].value.elapsed = parseInt(newValue)
    var newMode = document.querySelector('#counter-container-'+counter+ ' input[name="mode"]:checked').value;
    console.log(newMode)
    CounterObjs[`counter-${counter}`].value.mode = parseInt(newMode)
}
