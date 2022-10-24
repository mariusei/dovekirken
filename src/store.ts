import { writable } from 'svelte/store';

export const user = writable({})

export const titleMaster = writable("Døvekirken")
export const titlePage = writable("")
export const titleSub = writable("")
export const pictureMaster = writable("/images/smil.jpg")
	//import herobg from '$lib/images/smil.jpg'

export const locations = writable([
     {name: "Oslo", color: "border-dkext-5"}, 
     {name: "Sandefjord", color: "border-dkext-2"},
     {name: "Kristiansand", color: "border-dkext-3"},
     {name: "Stavanger",  color: "border-dkext-4"},
     {name: "Bergen", color:  "border-dkoth-1"},
     {name: "Trondheim", color: "border-dkoth-2"},
     {name: "Tromsø", color: "border-dkoth-3"}
    ])