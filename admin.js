// SUPABASE CONNECTION
const SUPABASE_URL =
"https://qvcipcwgzjttqvffdeye.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_LoD9J_ZNZWw5nTMOCmExjw_NgfvOvo6";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// LOAD WEBSITE SETTINGS
async function loadWebsiteSettings() {

  const { data, error } =
    await supabaseClient
      .from('website_settings')
      .select('*')
      .single();

  if(error){
    console.error(error);
    return;
  }

  document.getElementById('heroTitle').value =
    data.hero_title;

  document.getElementById('heroDescription').value =
    data.hero_description;
}

// UPDATE HERO SECTION
async function updateHeroSection() {

  const heroTitle =
    document.getElementById('heroTitle').value;

  const heroDescription =
    document.getElementById('heroDescription').value;

  const { error } =
    await supabaseClient
      .from('website_settings')
      .update({
        hero_title: heroTitle,
        hero_description: heroDescription
      })
      .eq('id', 1);

  if(error){
    console.error(error);
    alert('Update Failed');
    return;
  }

  alert('Hero Section Updated!');
}

// LOAD STORIES
async function loadStories() {

  const { data, error } =
    await supabaseClient
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

  if(error){
    console.error(error);
    return;
  }

  const storiesContainer =
    document.getElementById('storiesList');

  storiesContainer.innerHTML = '';

  data.forEach((story) => {

    storiesContainer.innerHTML += `
      <div class="bg-white rounded-2xl p-6 shadow">

        <h3 class="text-2xl font-bold">
          ${story.title}
        </h3>

        <p class="text-zinc-500 mt-2">
          ${story.verse}
        </p>

        <div class="flex gap-3 mt-6">

          <button
            onclick="deleteStory(${story.id})"
            class="bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            Delete
          </button>

        </div>
      </div>
    `;
  });
}

// CREATE STORY
async function createStory() {

  const title =
    document.getElementById('storyTitle').value;

  const verse =
    document.getElementById('storyVerse').value;

  const content =
    document.getElementById('storyContent').value;

  const slug =
    title.toLowerCase().replaceAll(' ', '-');

  const { error } =
    await supabaseClient
      .from('stories')
      .insert([
        {
          title,
          verse,
          content,
          slug
        }
      ]);

  if(error){
    console.error(error);
    alert('Failed Creating Story');
    return;
  }

  alert('Story Created!');

  loadStories();
}

// DELETE STORY
async function deleteStory(id) {

  const { error } =
    await supabaseClient
      .from('stories')
      .delete()
      .eq('id', id);

  if(error){
    console.error(error);
    return;
  }

  loadStories();
}

// INITIALIZE
loadWebsiteSettings();
loadStories();
