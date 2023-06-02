import type { WorkflowTitleStatus } from '@/Interface';

export function useTitleChange() {
	const titleSet = (workflow: string, status: WorkflowTitleStatus) => {
		let icon = '⚠️';
		if (status === 'EXECUTING') {
			icon = '🔄';
		} else if (status === 'IDLE') {
			icon = '▶️';
		}

		window.document.title = `XMS API - ${icon} ${workflow}`;
	};

	const titleReset = () => {
		window.document.title = 'XMS API - Workflow Automation';
	};

	return {
		titleSet,
		titleReset,
	};
}
