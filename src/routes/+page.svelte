<script lang="ts">
	import { createTask, deleteTask, getTasks } from '$lib/api/test/data.remote';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Toaster, toast } from 'svelte-sonner';

	let queryTasks = getTasks();
	let tasks = $derived(queryTasks?.current?.tasks ?? []);

	async function delete_task(id: string) {
		const result = await deleteTask({
			id: id
		});
		toast.success('success');
		queryTasks.refresh();
	}
</script>

<div class="container mx-2 space-y-2 px-2">
	<ul>
		{#if queryTasks?.loading}
			loading tasks....
		{:else}
			{#each tasks as task}
				<li>task {task.title} priority - {task.priority}</li>
				<button
					onclick={() => {
						delete_task(task.id);
					}}>delete</button
				>
			{/each}
		{/if}
	</ul>
</div>

<div class="container mt-5 px-2 py-2">
	<form
		{...createTask.enhance(async ({ form, data, submit }) => {
			try {
				await submit();
				form.reset();
				queryTasks.refresh();
				toast.success('Sucess');
			} catch (error) {
				toast.error('Event has not been created');
			}
		})}
		oninput={() => createTask.validate()}
	>
		<Label>task name</Label>
		<Input {...createTask.fields.title.as('text')} />
		<Label>priority</Label>
		<Input {...createTask.fields.priority.as('number')} />
		<Button type="submit">create task</Button>
	</form>
</div>
