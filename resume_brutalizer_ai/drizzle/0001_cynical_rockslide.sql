CREATE TABLE `dev_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`techStackTags` varchar(512) NOT NULL,
	`predictedHours` int,
	`complexityLevel` varchar(50),
	`architectureSuggestion` text,
	`recommendedFrameworks` text,
	`status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dev_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resume_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resumeFileName` varchar(255) NOT NULL,
	`resumeStorageKey` varchar(512) NOT NULL,
	`overallScore` int NOT NULL,
	`skillMatchData` text NOT NULL,
	`improvementSuggestions` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resume_audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `dev_tasks` ADD CONSTRAINT `dev_tasks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resume_audits` ADD CONSTRAINT `resume_audits_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;