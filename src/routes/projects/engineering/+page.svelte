<script lang="ts">
	import ProjectList, { type Project } from '$lib/components/ProjectList.svelte';

	// Placeholder entries — replace with real projects.
	const projects: Project[] = [
		{
			title: 'Quadruped Robot',
			description: 'A quadruped robot in development that will be done with a Sim2Real pipeline using ROS and IsaacSim.',
			media: 'https://github.com/Pazzann/quadruped-rl/raw/master/media/actuator.jpg',
            href: 'https://github.com/Pazzann/quadruped-rl',
			start: '2025'
		},
        {
            title: 'Wheelchair Accessory',
            description: 'A desk accessory that can be put on any wheelchair(with little modifications) and be used to hold a laptop, or anything else a disabled school student might need. Max rated weight of stuff on top is 5 kg.',
            media: '/wheelchair.png',
            start: '2026',
            end: '2026'
        },
		{
			title: 'KUKA PID Controller',
			description: 'Final project of modern robotics specialisation, A controller that should make KUKA robot move one object from one end effector to another end effector frame.',
			media: 'https://github.com/Pazzann/kuka-PID-controller/raw/master/demo.gif',
            href: 'https://github.com/Pazzann/kuka-PID-controller',
			start: '2025',
			end: '2025'
		},
		{
			title: 'IMechE Design Challenge 2024/2025',
			description: 'A project for the Engineering Design first-year course for the IMechE foundation design challenge 2024/2025. \n' +
                'The task was to create a device without the use of any programmable circuits that will move straight to the target, then wait for 10-15 seconds, and then return to the starting position backwards.',
			media: '/imechE.png',
            href: 'https://github.com/Pazzann/bfg.dev/blob/master/static/posterimeche.jpg',
			start: '2024',
            end: '2025'
		}
	];
</script>

<svelte:head>
	<title>Engineering</title>
	<meta name="description" content="bfg.dev — engineering projects" />
</svelte:head>

<ProjectList
	image="/reiengineering.jpg"
	title="ls ./engineering"
	{projects}
	back={{ label: 'cd ../', href: '/projects' }}
/>
