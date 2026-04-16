export default class NoteEntity {
  constructor({ id, title, content, imageUrl,isPrivate, password, userid }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl|| null;
    this.isPrivate = isPrivate || false;
    this.password = password || null;
    this.userid = userid;
   }
}