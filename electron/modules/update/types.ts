export type UpdateLabelSet = { title: string; body: string };

export type UpdateLabels = {
	available: UpdateLabelSet;
	ready: UpdateLabelSet;
};
