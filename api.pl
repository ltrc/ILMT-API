#!/usr/bin/env perl
use Dir::Self;
use strict;
use warnings;
use Data::Dumper;
use Mojolicious::Lite;
use lib __DIR__ . "/lib";
use ILMT::Translator qw(get_translator);
use ILMT::HIN::PAN;

plugin qw(Mojolicious::Plugin::ForkCall);

any '/:src/:tgt/translate' => sub {
    my $c = shift->render_later;
    $c->inactivity_timeout(3600);
    my %args = %{$c->req->params->to_hash};
    $args{'src_lang'} = $c->param('src');
    $args{'tgt_lang'} = $c->param('tgt');
    $c->fork_call(
        sub {
            my (%args) = @_;
            my $translator = get_translator(uc($c->param('src')), uc($c->param('tgt')));
            return $translator->translate(%args);
        },
        [%args],
        sub {
            my ($c, $final_result) = @_;
            if (exists $args{"pretty"}) {
                my $final_string = join "\n", map { "$_:\n$final_result->{$_}" } keys %$final_result;
                $c->render(template => 'pretty', result => $final_string);
            } else {
                $c->render(json => $final_result);
            }
        }
    );
};

app->start;
__DATA__

@@ pretty.html.ep
<pre><%= $result %></pre>
