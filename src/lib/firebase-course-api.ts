import { db, auth } from './firebase';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    writeBatch,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import type { Course, Module, Lesson, LessonContent, LessonContentType, FirestoreTimestamp } from './course-types';
import { courseTemplates, defaultCourseTemplate } from './course-templates';

// --- Helper to get current user ID ---
const getCurrentUserId = (): string | null => {
    if (!auth) {
        console.error('Firebase auth not initialized');
        return null;
    }
    return auth.currentUser?.uid || null;
};

// --- Firestore Collection References ---
const getCoursesCollection = () => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    return collection(db, 'courses');
};

const getModulesCollection = (courseId: string) => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    if (!courseId) {
        throw new Error('Course ID is required');
    }
    return collection(db, `courses/${courseId}/modules`);
};

const getLessonsCollection = (courseId: string, moduleId: string) => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    if (!courseId || !moduleId) {
        throw new Error('Course ID and Module ID are required');
    }
    return collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);
};

// --- Course Functions ---

export const createCourse = async (
    title: string,
    description?: string,
    template?: Partial<Course>
): Promise<string> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');

    if (!title?.trim()) {
        throw new Error('Course title is required');
    }

    try {
        const newCourseData = {
            title: title.trim(),
            description: description?.trim() || defaultCourseTemplate.description,
            instructorId,
            thumbnailUrl: template?.thumbnailUrl || defaultCourseTemplate.image,
            isPublished: false,
            modulesOrder: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const courseRef = await addDoc(getCoursesCollection(), newCourseData);
        return courseRef.id;
    } catch (error) {
        console.error('Error creating course:', error);
        throw new Error('Failed to create course. Please try again.');
    }
};

export const createCourseFromTemplate = async (
    templateId: string
): Promise<string> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');

    if (!templateId?.trim()) {
        throw new Error('Template ID is required');
    }

    const template = courseTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found.');

    try {
        // Create the course
        const newCourseData = {
            title: template.title,
            description: template.description,
            instructorId,
            thumbnailUrl: template.image,
            isPublished: false,
            modulesOrder: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const courseRef = await addDoc(getCoursesCollection(), newCourseData);
        const courseId = courseRef.id;

        // If template has modules, create them
        if (template.modules && template.modules.length > 0) {
            if (!db) {
                throw new Error('Firebase database not initialized');
            }

            const batch = writeBatch(db);
            const moduleIds: string[] = [];

            for (const templateModule of template.modules) {
                if (!templateModule.title?.trim()) {
                    console.warn('Skipping module with empty title');
                    continue;
                }

                // Create module
                const moduleRef = doc(getModulesCollection(courseId));
                const moduleData = {
                    title: templateModule.title.trim(),
                    description: templateModule.description?.trim() || '',
                    lessonsOrder: [],
                };
                batch.set(moduleRef, moduleData);
                moduleIds.push(moduleRef.id);

                // Create lessons for this module
                const lessonIds: string[] = [];
                if (templateModule.lessons && templateModule.lessons.length > 0) {
                    for (const templateLesson of templateModule.lessons) {
                        if (!templateLesson.title?.trim()) {
                            console.warn('Skipping lesson with empty title');
                            continue;
                        }

                        const lessonRef = doc(getLessonsCollection(courseId, moduleRef.id));
                        const lessonData = {
                            title: templateLesson.title.trim(),
                            contentType: templateLesson.contentType,
                            content: templateLesson.content || {},
                            estimatedDurationMinutes: templateLesson.estimatedDurationMinutes || 0,
                        };
                        batch.set(lessonRef, lessonData);
                        lessonIds.push(lessonRef.id);
                    }
                }

                // Update module with lessons order
                batch.update(moduleRef, { lessonsOrder: lessonIds });
            }

            // Update course with modules order
            batch.update(courseRef, { modulesOrder: moduleIds });

            await batch.commit();
        }

        return courseId;
    } catch (error) {
        console.error('Error creating course from template:', error);
        throw new Error('Failed to create course from template. Please try again.');
    }
};

export const getUserCourses = async (): Promise<Course[]> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) return [];

    try {
        const q = query(getCoursesCollection(), where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Course));
    } catch (error) {
        console.error('Error fetching user courses:', error);
        return [];
    }
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const docRef = doc(db, 'courses', courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Course;
        }
        return null;
    } catch (error) {
        console.error('Error fetching course:', error);
        throw new Error('Failed to fetch course. Please try again.');
    }
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
        throw new Error('Updates are required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const docRef = doc(db, 'courses', courseId);
        await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error('Error updating course:', error);
        throw new Error('Failed to update course. Please try again.');
    }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const batch = writeBatch(db);
        const courseRef = doc(db, 'courses', courseId);

        // Delete all lessons and modules within the course
        const modulesSnapshot = await getDocs(getModulesCollection(courseId));
        for (const moduleDoc of modulesSnapshot.docs) {
            const lessonsSnapshot = await getDocs(getLessonsCollection(courseId, moduleDoc.id));
            lessonsSnapshot.docs.forEach(lessonDoc => {
                batch.delete(lessonDoc.ref);
            });
            batch.delete(moduleDoc.ref);
        }
        
        batch.delete(courseRef);
        await batch.commit();
    } catch (error) {
        console.error('Error deleting course:', error);
        throw new Error('Failed to delete course. Please try again.');
    }
};

// --- Module Functions ---

export const addModule = async (courseId: string, title: string, description?: string): Promise<{ moduleId: string, updatedModulesOrder: string[] }> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!title?.trim()) {
        throw new Error('Module title is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const courseRef = doc(db, 'courses', courseId);
        const newModuleRef = doc(getModulesCollection(courseId));
        
        const newModule: Omit<Module, 'id'> = {
            title: title.trim(),
            description: description?.trim() || '',
            lessonsOrder: [],
        };

        await writeBatch(db)
            .set(newModuleRef, newModule)
            .update(courseRef, { modulesOrder: arrayUnion(newModuleRef.id) })
            .commit();

        const updatedCourse = await getCourse(courseId);
        return { moduleId: newModuleRef.id, updatedModulesOrder: updatedCourse?.modulesOrder || [] };
    } catch (error) {
        console.error('Error adding module:', error);
        throw new Error('Failed to add module. Please try again.');
    }
};

export const getModules = async (courseId: string, modulesOrderFromCourse?: string[]): Promise<Module[]> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    try {
        const modulesSnapshot = await getDocs(getModulesCollection(courseId));
        const modules = modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
        
        const order = modulesOrderFromCourse || (await getCourse(courseId))?.modulesOrder || [];
        
        return modules.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
    }
};

export const updateModule = async (courseId: string, moduleId: string, updates: Partial<Module>): Promise<void> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
        throw new Error('Updates are required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
        await updateDoc(moduleRef, updates);
    } catch (error) {
        console.error('Error updating module:', error);
        throw new Error('Failed to update module. Please try again.');
    }
};

export const deleteModule = async (courseId: string, moduleId: string): Promise<string[]> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const courseRef = doc(db, 'courses', courseId);
        const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);

        // Delete all lessons in the module
        const lessonsSnapshot = await getDocs(getLessonsCollection(courseId, moduleId));
        const batch = writeBatch(db);
        lessonsSnapshot.docs.forEach(lessonDoc => batch.delete(lessonDoc.ref));
        batch.delete(moduleRef);
        batch.update(courseRef, { modulesOrder: arrayRemove(moduleId) });
        await batch.commit();

        const updatedCourse = await getCourse(courseId);
        return updatedCourse?.modulesOrder || [];
    } catch (error) {
        console.error('Error deleting module:', error);
        throw new Error('Failed to delete module. Please try again.');
    }
};

export const updateModulesOrder = async (courseId: string, newOrder: string[]): Promise<void> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!Array.isArray(newOrder)) {
        throw new Error('New order must be an array');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, { modulesOrder: newOrder });
    } catch (error) {
        console.error('Error updating modules order:', error);
        throw new Error('Failed to update modules order. Please try again.');
    }
};


// --- Lesson Functions ---

export const addLesson = async (
    courseId: string,
    moduleId: string,
    title: string,
    contentType: LessonContentType,
    content: LessonContent
): Promise<{ lessonId: string, updatedLessonsOrder: string[] }> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!title?.trim()) {
        throw new Error('Lesson title is required');
    }

    if (!contentType) {
        throw new Error('Content type is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
        const newLessonRef = doc(getLessonsCollection(courseId, moduleId));

        const newLesson: Omit<Lesson, 'id'> = {
            title: title.trim(),
            contentType,
            content: content || {},
        };

        await writeBatch(db)
            .set(newLessonRef, newLesson)
            .update(moduleRef, { lessonsOrder: arrayUnion(newLessonRef.id) })
            .commit();
            
        const updatedModuleSnap = await getDoc(moduleRef);
        const updatedModule = updatedModuleSnap.data() as Module;

        return { lessonId: newLessonRef.id, updatedLessonsOrder: updatedModule.lessonsOrder || [] };
    } catch (error) {
        console.error('Error adding lesson:', error);
        throw new Error('Failed to add lesson. Please try again.');
    }
};

export const getLessons = async (courseId: string, moduleId: string, lessonsOrderFromModule?: string[]): Promise<Lesson[]> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const lessonsSnapshot = await getDocs(getLessonsCollection(courseId, moduleId));
        const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));

        let order = lessonsOrderFromModule;
        if (!order) {
            const moduleSnap = await getDoc(doc(db, `courses/${courseId}/modules`, moduleId));
            order = (moduleSnap.data() as Module)?.lessonsOrder || [];
        }
        
        return lessons.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return [];
    }
};

export const updateLesson = async (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!lessonId?.trim()) {
        throw new Error('Lesson ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
        throw new Error('Updates are required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const lessonRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
        await updateDoc(lessonRef, updates);
    } catch (error) {
        console.error('Error updating lesson:', error);
        throw new Error('Failed to update lesson. Please try again.');
    }
};

export const deleteLesson = async (courseId: string, moduleId: string, lessonId: string): Promise<string[]> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!lessonId?.trim()) {
        throw new Error('Lesson ID is required');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
        const lessonRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);

        await writeBatch(db)
            .delete(lessonRef)
            .update(moduleRef, { lessonsOrder: arrayRemove(lessonId) })
            .commit();

        const updatedModuleSnap = await getDoc(moduleRef);
        return (updatedModuleSnap.data() as Module)?.lessonsOrder || [];
    } catch (error) {
        console.error('Error deleting lesson:', error);
        throw new Error('Failed to delete lesson. Please try again.');
    }
};

export const updateLessonsOrder = async (courseId: string, moduleId: string, newOrder: string[]): Promise<void> => {
    if (!courseId?.trim()) {
        throw new Error('Course ID is required');
    }

    if (!moduleId?.trim()) {
        throw new Error('Module ID is required');
    }

    if (!Array.isArray(newOrder)) {
        throw new Error('New order must be an array');
    }

    if (!db) {
        throw new Error('Firebase database not initialized');
    }

    try {
        const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
        await updateDoc(moduleRef, { lessonsOrder: newOrder });
    } catch (error) {
        console.error('Error updating lessons order:', error);
        throw new Error('Failed to update lessons order. Please try again.');
    }
};